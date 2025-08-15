/**
 * 优化的MCP客户端工具
 * Optimized MCP Client Utilities
 */

import { apiClient } from '$lib/utils/apiClient';
import { ErrorHandler } from '$lib/utils/errorHandler';
import { logger } from '$lib/utils/logger';

/**
 * MCP客户端类
 * MCP Client Class
 */
export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/mcp') {
    this.baseUrl = baseUrl;
    logger.info('MCP Client initialized', {
      component: 'MCPClient',
      action: 'initialize',
      metadata: { baseUrl }
    });
  }

  /**
   * 调用MCP提示词
   * Call MCP prompt
   */
  async callPrompt(promptName: string, args: Record<string, any> = {}): Promise<string> {
    const startTime = Date.now();

    logger.info('MCP prompt call started', {
      component: 'MCPClient',
      action: 'callPrompt',
      metadata: { promptName, argsCount: Object.keys(args).length }
    });

    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'prompts/get',
        params: {
          name: promptName,
          arguments: args
        }
      };

      const response = (await apiClient.post(this.baseUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream'
        }
      })) as any;

      // 解析提示词内容
      let promptContent: string | undefined;
      if (response.events && Array.isArray(response.events) && response.events.length > 0) {
        const firstEvent = response.events[0];
        if (firstEvent.data && firstEvent.data.result) {
          promptContent = firstEvent.data.result.messages?.[0]?.content?.text;
        }
      } else if (response.result) {
        promptContent = response.result.messages?.[0]?.content?.text;
      }

      if (!promptContent) {
        throw ErrorHandler.createApiError('Invalid MCP prompt response format');
      }

      const duration = Date.now() - startTime;
      logger.info('MCP prompt call completed', {
        component: 'MCPClient',
        action: 'callPrompt',
        duration,
        metadata: {
          promptName,
          contentLength: promptContent.length,
          success: true
        }
      });

      return promptContent;
    } catch (error) {
      const duration = Date.now() - startTime;
      const handledError = ErrorHandler.handle(error, {
        component: 'MCPClient',
        action: 'callPrompt',
        duration,
        metadata: { promptName, args }
      });

      throw handledError;
    }
  }

  /**
   * 获取所有可用的MCP提示词
   * Get all available MCP prompts
   */
  async listPrompts(): Promise<any[]> {
    const startTime = Date.now();

    logger.info('MCP prompts list request started', {
      component: 'MCPClient',
      action: 'listPrompts'
    });

    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'prompts/list',
        params: {}
      };

      const response = (await apiClient.post(this.baseUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream'
        }
      })) as any;
      let prompts: any[] = [];

      // 解析提示词列表响应
      if (response.events && Array.isArray(response.events) && response.events.length > 0) {
        const firstEvent = response.events[0];
        if (firstEvent.data && firstEvent.data.result && firstEvent.data.result.prompts) {
          prompts = firstEvent.data.result.prompts;
        }
      } else if (response.result && response.result.prompts) {
        prompts = response.result.prompts;
      }

      const duration = Date.now() - startTime;
      logger.info('MCP prompts list request completed', {
        component: 'MCPClient',
        action: 'listPrompts',
        duration,
        metadata: {
          promptsCount: prompts.length,
          success: true
        }
      });

      return prompts;
    } catch (error) {
      const duration = Date.now() - startTime;
      const handledError = ErrorHandler.handle(error, {
        component: 'MCPClient',
        action: 'listPrompts',
        duration
      });

      throw handledError;
    }
  }

  /**
   * 获取所有可用的MCP工具
   * Get all available MCP tools
   */
  async listTools(): Promise<any[]> {
    const startTime = Date.now();

    logger.info('MCP tools list request started', {
      component: 'MCPClient',
      action: 'listTools'
    });

    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/list',
        params: {}
      };

      const response = (await apiClient.post(this.baseUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream'
        }
      })) as any;
      let tools: any[] = [];

      // 解析工具列表响应
      if (response.events && Array.isArray(response.events) && response.events.length > 0) {
        const firstEvent = response.events[0];
        if (firstEvent.data && firstEvent.data.result && firstEvent.data.result.tools) {
          tools = firstEvent.data.result.tools;
        }
      } else if (response.result && response.result.tools) {
        tools = response.result.tools;
      }

      const duration = Date.now() - startTime;
      logger.info('MCP tools list request completed', {
        component: 'MCPClient',
        action: 'listTools',
        duration,
        metadata: {
          toolsCount: tools.length,
          success: true
        }
      });

      return tools;
    } catch (error) {
      const duration = Date.now() - startTime;
      const handledError = ErrorHandler.handle(error, {
        component: 'MCPClient',
        action: 'listTools',
        duration
      });

      throw handledError;
    }
  }

  /**
   * 调用MCP工具
   * Call MCP tool
   */
  async callTool(toolName: string, args: Record<string, any> = {}): Promise<any> {
    const startTime = Date.now();
    logger.info('MCP tool call started', {
      component: 'MCPClient',
      action: 'callTool',
      metadata: { toolName, argsCount: Object.keys(args).length }
    });

    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      };

      const response = (await apiClient.post(this.baseUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream'
        }
      })) as any;

      // 解析工具调用结果
      let toolResult: any;
      if (response.events && Array.isArray(response.events) && response.events.length > 0) {
        const firstEvent = response.events[0];
        if (firstEvent.data && firstEvent.data.result) {
          toolResult = firstEvent.data.result;
        }
      } else if (response.result) {
        toolResult = response.result;
      }

      if (!toolResult) {
        throw ErrorHandler.createApiError('Invalid MCP tool response format');
      }

      const duration = Date.now() - startTime;
      logger.info('MCP tool call completed', {
        component: 'MCPClient',
        action: 'callTool',
        duration,
        metadata: {
          toolName,
          success: true,
          resultSize: JSON.stringify(toolResult).length
        }
      });

      return toolResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      const handledError = ErrorHandler.handle(error, {
        component: 'MCPClient',
        action: 'callTool',
        duration,
        metadata: { toolName, args }
      });

      throw handledError;
    }
  }

  /**
   * 初始化会话
   * Initialize session
   */
  async initializeSession(language: string = 'zh'): Promise<string> {
    logger.info('Session initialization started', {
      component: 'MCPClient',
      action: 'initializeSession',
      metadata: { language }
    });

    try {
      const prompt = await this.callPrompt('init-session', { language });

      logger.info('Session initialization completed', {
        component: 'MCPClient',
        action: 'initializeSession',
        metadata: { language, success: true }
      });

      return prompt;
    } catch (error) {
      logger.error('Session initialization failed', error, {
        component: 'MCPClient',
        action: 'initializeSession',
        metadata: { language }
      });
      throw error;
    }
  }
}

// 导出默认客户端实例
export const mcpClient = new MCPClient();
