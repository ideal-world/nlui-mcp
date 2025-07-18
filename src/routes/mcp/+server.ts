import { createFakeIncomingMessage, createServerResponseAdapter, extractEventData, type BodyType } from '$lib/server/httpAdapter';
import mcpServer from '$lib/server/mcpServer';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
	const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
	});
	await mcpServer.connect(transport);

	let bodyContent: BodyType;
	const contentType = request.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		bodyContent = await request.json();
	} else {
		bodyContent = await request.text();
	}

	const incomingRequest = createFakeIncomingMessage({
		method: request.method,
		url: request.url,
		headers: Object.fromEntries(request.headers),
		body: bodyContent
	});

	const response = await createServerResponseAdapter(request.signal, async (res) => {
		await transport.handleRequest(incomingRequest, res);
	});

	const eventDataInfo = extractEventData(await response.text());
	// Create a new response with the same data since the original response body was consumed
	return new Response(JSON.stringify(eventDataInfo), {
		status: response.status,
		statusText: response.statusText,
		headers: new Headers({
			'Content-Type': 'application/json',
			...Object.fromEntries(response.headers)
		})
	});
}

// SSE notifications not supported in stateless mode
export async function GET() {
	console.log('Received GET MCP request');
	return json({
		jsonrpc: "2.0",
		error: {
			code: -32000,
			message: "Method not allowed."
		},
		id: null
	}, { status: 405 });
}

// Session termination not needed in stateless mode
export async function DELETE() {
	console.log('Received DELETE MCP request');
	return json({
		jsonrpc: "2.0",
		error: {
			code: -32000,
			message: "Method not allowed."
		},
		id: null
	}, { status: 405 });
}
