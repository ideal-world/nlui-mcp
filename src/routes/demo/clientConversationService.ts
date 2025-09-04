/**
 * 前端对话服务 - 基于OpenAI API标准的实现
 * Frontend Conversation Service - OpenAI API Standards Implementation
 */

import { logger } from '$lib/utils/logger';
import { mcpClient } from '$lib/utils/mcpClient';
import { OpenAIClient, type OpenAIMessage, type OpenAITool } from '$lib/utils/openAIClient';

interface ConversationSession {
  id: string;
  messages: OpenAIMessage[];
  tools: OpenAITool[];
  systemPromptLoaded: boolean;
  toolsLoaded: boolean;
  createdAt: number;
}

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

const openAIClient = new OpenAIClient(baseUrl, apiKey);

// 本地会话存储
const sessions = new Map<string, ConversationSession>();

/**
 * 获取或创建对话会话
 */
function getOrCreateSession(sessionId: string): ConversationSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      messages: [],
      tools: [],
      systemPromptLoaded: false,
      toolsLoaded: false,
      createdAt: Date.now()
    });
  }
  return sessions.get(sessionId)!;
}

/**
 * 将MCP工具转换为OpenAI工具格式
 */
function convertMCPToolToOpenAI(mcpTool: any): OpenAITool {
  return {
    type: 'function',
    function: {
      name: mcpTool.name,
      description: mcpTool.description,
      parameters: mcpTool.inputSchema || {
        type: 'object',
        properties: {},
        required: []
      }
    }
  };
}

/**
 * 初始化会话 - 加载系统提示词和工具
 */
async function initializeSession(session: ConversationSession, language = 'zh'): Promise<void> {
  // 1. 获取init-session系统提示词
  if (!session.systemPromptLoaded) {
    try {
      const systemPrompt = await mcpClient.initializeSession(language);
      session.messages.unshift({
        role: 'system',
        content: systemPrompt
      });
      session.systemPromptLoaded = true;
      logger.info('System prompt loaded', {
        component: 'ConversationService',
        action: 'loadSystemPrompt',
        metadata: { length: systemPrompt.length }
      });
    } catch (error) {
      console.error('❌ 系统提示词加载失败:', error);
      throw new Error('Failed to load system prompt');
    }
  }

  // 2. 获取所有可用工具
  if (!session.toolsLoaded) {
    try {
      const mcpTools = await mcpClient.listTools();
      session.tools = mcpTools.map(convertMCPToolToOpenAI);
      session.toolsLoaded = true;
      logger.info('Tools loaded', {
        component: 'ConversationService',
        action: 'loadTools',
        metadata: { toolCount: session.tools.length }
      });
    } catch (error) {
      console.error('❌ 工具列表加载失败:', error);
      throw new Error('Failed to load tools');
    }
  }
}

/**
 * 处理工具调用响应
 */
async function handleToolCalls(session: ConversationSession, assistantMessage: OpenAIMessage): Promise<{ nluiConfig?: any; uiUrl?: string }> {
  if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
    return {};
  }

  // 添加助手消息到会话历史（包含工具调用）
  session.messages.push(assistantMessage);

  let uiUrl: string | undefined;

  // 执行所有工具调用
  for (const toolCall of assistantMessage.tool_calls) {
    try {
      logger.info('Executing tool call', {
        component: 'ConversationService',
        action: 'executeToolCall',
        metadata: { toolName: toolCall.function.name }
      });

      const args = JSON.parse(toolCall.function.arguments);
      const result = await mcpClient.callTool(toolCall.function.name, args);

      logger.info('Tool call successful', {
        component: 'ConversationService',
        action: 'executeToolCall',
        metadata: { toolName: toolCall.function.name, success: true }
      });

      // 添加工具响应消息
      const toolMessage: OpenAIMessage = {
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: `Tool executed successfully: ${toolCall.function.name}`
      };
      session.messages.push(toolMessage);

      // 如果是ui-render工具，提取UI配置和URL
      if (toolCall.function.name === 'ui-render' && result.content?.[0]?.resource?.uri) {
        uiUrl = result.content?.[0]?.resource?.uri || '';
        logger.info('UI component generated', {
          component: 'ConversationService',
          action: 'generateUI',
          metadata: { uiUrl }
        });
      }
    } catch (error) {
      // 添加错误消息
      const errorMessage: OpenAIMessage = {
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      session.messages.push(errorMessage);
    }
  }

  return { uiUrl };
}

/**
 * 处理对话消息 - 基于OpenAI API标准
 */
export async function processConversationClient(
  sessionId: string,
  userMessage: string,
  language = 'zh',
  returnRawContent = false
): Promise<
  | {
      response: string;
      nluiConfig?: any;
      uiUrl?: string;
      meta: {
        timestamp: string;
        usedTools: boolean;
        model: string;
        finishReason: string;
      };
    }
  | OpenAIMessage
> {
  logger.info('Processing conversation started', {
    component: 'ConversationService',
    action: 'processConversation',
    metadata: { sessionId, language }
  });

  // 获取或创建会话
  const session = getOrCreateSession(sessionId);

  // 初始化会话（加载系统提示词和工具）
  await initializeSession(session, language);

  // 添加用户消息
  const userMsg: OpenAIMessage = {
    role: 'user',
    content: userMessage
  };
  session.messages.push(userMsg);

  try {
    logger.info('Session status', {
      component: 'ConversationService',
      action: 'checkSessionStatus',
      metadata: {
        messageCount: session.messages.length,
        toolCount: session.tools.length
      }
    });

    const startTime = Date.now();
    const result = await openAIClient.call(session.messages, session.tools, model);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    logger.info('OpenAI API call successful', {
      component: 'ConversationService',
      action: 'callOpenAI',
      metadata: { responseTime: responseTime, result: result }
    });

    const choice = result.choices[0];
    const assistantMessage = choice.message;

    if (returnRawContent) {
      return assistantMessage;
    }

    let uiUrl: string | undefined;

    // 检查是否有工具调用
    if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls) {
      logger.info('Tool calls detected', {
        component: 'ConversationService',
        action: 'detectToolCalls',
        metadata: { toolCallCount: assistantMessage.tool_calls.length }
      });

      const toolResults = await handleToolCalls(session, assistantMessage);
      uiUrl = toolResults.uiUrl;

      if (uiUrl) {
        return {
          response: assistantMessage.content || '界面已生成，请查看下方的交互组件。',
          uiUrl,
          meta: {
            timestamp: new Date().toISOString(),
            usedTools: true,
            model: result.model,
            finishReason: choice.finish_reason
          }
        };
      }
    } else {
      // 没有工具调用，直接添加助手响应
      session.messages.push(assistantMessage);
    }

    return {
      response: assistantMessage.content || '',
      uiUrl,
      meta: {
        timestamp: new Date().toISOString(),
        usedTools: !!uiUrl,
        model: result.model,
        finishReason: choice.finish_reason
      }
    };
  } catch (error) {
    logger.error('Conversation processing failed', {
      component: 'ConversationService',
      action: 'processConversation',
      metadata: { sessionId, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    throw error;
  }
}

/**
 * 重置会话
 */
export function resetSessionClient(sessionId: string): void {
  sessions.delete(sessionId);
  logger.info('Session reset', {
    component: 'ConversationService',
    action: 'resetSession',
    metadata: { sessionId }
  });
}

/**
 * 获取会话信息
 */
export function getSessionInfoClient(sessionId: string): {
  exists: boolean;
  messageCount: number;
  systemPromptLoaded: boolean;
  toolsLoaded: boolean;
  toolsCount: number;
} {
  const session = sessions.get(sessionId);
  return {
    exists: !!session,
    messageCount: session?.messages.length || 0,
    systemPromptLoaded: session?.systemPromptLoaded || false,
    toolsLoaded: session?.toolsLoaded || false,
    toolsCount: session?.tools.length || 0
  };
}
