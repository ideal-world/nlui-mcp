import { EventEmitter } from 'node:events';
import type { ServerResponse } from 'node:http';
import { type IncomingHttpHeaders, IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { Readable } from 'node:stream';

/**
 * Supported body types for HTTP requests
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BodyType = string | Buffer | Record<string, any> | null;

/**
 * Options for creating a fake IncomingMessage
 */
export interface FakeIncomingMessageOptions {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Request URL */
  url: string;
  /** HTTP headers */
  headers: IncomingHttpHeaders;
  /** Request body data */
  body?: BodyType;
  /** Network socket (optional) */
  socket?: Socket;
}

/**
 * Creates a fake IncomingMessage for testing or simulation purposes
 *
 * Modified from https://github.com/vercel/mcp-adapter
 *
 * @param options Configuration options for the fake request
 * @returns A mock IncomingMessage instance
 */
export function createFakeIncomingMessage(
  options: FakeIncomingMessageOptions = {
    method: 'POST',
    url: '/',
    headers: {}
  }
): IncomingMessage {
  const { method, url, headers, body = null, socket = new Socket() } = options;

  const readable = new Readable();
  readable._read = (): void => {};

  if (body) {
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      readable.push(body);
    } else {
      readable.push(JSON.stringify(body));
    }
  }
  readable.push(null);

  const req = new IncomingMessage(socket) as IncomingMessage;
  req.method = method;
  req.url = url;
  req.headers = headers;

  req.push = readable.push.bind(readable);
  req.read = readable.read.bind(readable);
  // @ts-expect-error
  req.on = readable.on.bind(readable);
  req.pipe = readable.pipe.bind(readable);

  return req;
}

/**
 * Arguments for the writeHead method
 */
type WriteheadArgs = {
  statusCode: number;
  headers?: Record<string, string>;
};

/**
 * Generic event listener function type
 */
type EventListener = (...args: unknown[]) => void;

/**
 * Creates a server response adapter that converts Node.js ServerResponse to Web API Response
 *
 * Modified from https://github.com/vercel/mcp-adapter
 *
 * @param signal AbortSignal to handle request cancellation
 * @param fn Function that processes the server response
 * @returns Promise that resolves to a Web API Response
 */
export function createServerResponseAdapter(signal: AbortSignal, fn: (re: ServerResponse) => Promise<void> | void): Promise<Response> {
  let writeHeadResolver: (v: WriteheadArgs) => void;
  const writeHeadPromise = new Promise<WriteheadArgs>((resolve) => {
    writeHeadResolver = resolve;
  });

  return new Promise((resolve) => {
    let controller: ReadableStreamController<Uint8Array> | undefined;
    let shouldClose = false;
    let wroteHead = false;
    let statusCode = 200;
    let headers: Record<string, string> | undefined;

    /**
     * Writes response headers and status code
     * @param code HTTP status code
     * @param headersArg Response headers
     * @returns The fake server response instance
     */
    const writeHead = (code: number, headersArg?: Record<string, string>) => {
      if (typeof headersArg === 'string') {
        throw new Error('Status message of writeHead not supported');
      }
      statusCode = code;
      headers = headersArg;
      wroteHead = true;
      writeHeadResolver({
        statusCode,
        headers
      });
      return fakeServerResponse;
    };

    const bufferedData: Uint8Array[] = [];

    /**
     * Writes data to the response stream
     * @param chunk Data chunk to write
     * @param encoding Buffer encoding (not supported)
     * @returns Always returns true
     */
    const write = (chunk: Buffer | string, encoding?: BufferEncoding): boolean => {
      if (encoding) {
        throw new Error('Encoding not supported');
      }
      if (chunk instanceof Buffer) {
        throw new Error('Buffer not supported');
      }
      if (!wroteHead) {
        writeHead(statusCode, headers);
      }
      if (!controller) {
        bufferedData.push(new TextEncoder().encode(chunk as string));
        return true;
      }
      controller.enqueue(new TextEncoder().encode(chunk as string));
      return true;
    };

    const eventEmitter = new EventEmitter();

    /**
     * Fake server response object that mimics Node.js ServerResponse behavior
     */
    const fakeServerResponse = {
      writeHead,
      write,
      /**
       * Ends the response stream
       * @param data Optional data to write before ending
       * @returns The fake server response instance
       */
      end: (data?: Buffer | string) => {
        if (data) {
          write(data);
        }

        if (!controller) {
          shouldClose = true;
          return fakeServerResponse;
        }
        try {
          controller.close();
        } catch {
          /* May be closed on tcp layer */
        }
        return fakeServerResponse;
      },
      /**
       * Registers an event listener
       * @param event Event name to listen for
       * @param listener Function to call when event is emitted
       * @returns The fake server response instance
       */
      on: (event: string, listener: EventListener) => {
        eventEmitter.on(event, listener);
        return fakeServerResponse;
      },
      /**
       * Gets the current status code
       * @returns The HTTP status code
       */
      get statusCode() {
        return statusCode;
      },
      /**
       * Sets the status code
       * @param code The HTTP status code to set
       */
      set statusCode(code: number) {
        statusCode = code;

        // If the status code is set after writeHead, we need to call
        // writeHead again to update the status code.
        if (wroteHead) {
          writeHeadResolver({
            statusCode,
            headers
          });
        }
      }
    };

    signal.addEventListener('abort', () => {
      eventEmitter.emit('close');
    });

    void fn(fakeServerResponse as ServerResponse);

    void (async () => {
      const head = await writeHeadPromise;

      const response = new Response(
        new ReadableStream({
          start(c) {
            controller = c;
            for (const chunk of bufferedData) {
              controller.enqueue(chunk);
            }
            if (shouldClose) {
              controller.close();
            }
          }
        }),
        {
          status: head.statusCode,
          headers: head.headers
        }
      );

      resolve(response);
    })();
  });
}

/**
 * Extracts event data from Server-Sent Events (SSE) formatted response body
 * @param responseBody The raw response body string to parse
 * @returns Parsed events object or error information
 */
export function extractEventData(responseBody: string) {
  try {
    // First try to parse as JSON directly
    try {
      const jsonData = JSON.parse(responseBody);
      return { events: [{ event: 'message', data: jsonData }] };
    } catch {
      // Not directly JSON, process as SSE format
      const events: { event: string; data: unknown }[] = [];
      const lines = responseBody.split(/\r?\n/);

      let currentEvent = 'message';
      let currentData = '';

      for (const line of lines) {
        if (!line.trim()) {
          // Empty line marks the end of an event
          if (currentData) {
            try {
              // Try to parse data as JSON
              const jsonData = JSON.parse(currentData);
              events.push({ event: currentEvent, data: jsonData });
            } catch {
              // If not JSON, store as string
              events.push({ event: currentEvent, data: currentData });
            }
            currentEvent = 'message';
            currentData = '';
          }
          continue;
        }
        if (line.startsWith('event:')) {
          currentEvent = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          currentData += line.substring(5).trim();
        }
      }
      // Process any remaining data
      if (currentData) {
        try {
          const jsonData = JSON.parse(currentData);
          events.push({ event: currentEvent, data: jsonData });
        } catch {
          events.push({ event: currentEvent, data: currentData });
        }
      }
      return { events };
    }
  } catch (error) {
    console.error('Error extracting event data:', error);
    return {
      error: 'Failed to extract event data',
      rawResponse: responseBody
    };
  }
}
