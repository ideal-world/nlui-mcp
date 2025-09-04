/**
 * OpenAI客户端工具
 * OpenAI Client Utilities
 */

import { logger } from '$lib/utils/logger';

// OpenAI API标准接口定义
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: OpenAIToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface OpenAIToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface OpenAITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface OpenAIResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: 'stop' | 'tool_calls' | 'length' | 'content_filter';
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('未配置OpenAI API密钥');
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    logger.info('OpenAI Client initialized', {
      component: 'OpenAIClient',
      action: 'initialize',
      metadata: { baseUrl }
    });
  }

  /**
   * 调用OpenAI API
   */
  async call(messages: OpenAIMessage[], tools: OpenAITool[], model: string): Promise<OpenAIResponse> {
    try {
      const requestBody: any = {
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
          ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
          ...(msg.name && { name: msg.name })
        }))
      };

      // 如果有工具，添加到请求中
      if (tools.length > 0) {
        requestBody.tools = tools;
        requestBody.tool_choice = 'auto'; // 让模型自动决定是否调用工具
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ OpenAI API调用失败', error);
      throw error;
    }
  }
}
