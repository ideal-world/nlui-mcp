/**
 * 前端对话服务 - 基于OpenAI API标准的实现
 * Frontend Conversation Service - OpenAI API Standards Implementation
 */

import { mcpClient } from './mcpClient';

// OpenAI API标准接口定义
interface OpenAIMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | null;
	tool_calls?: OpenAIToolCall[];
	tool_call_id?: string;
	name?: string;
}

interface OpenAIToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

interface OpenAITool {
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

interface OpenAIResponse {
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

interface ConversationSession {
	id: string;
	messages: OpenAIMessage[];
	tools: OpenAITool[];
	systemPromptLoaded: boolean;
	toolsLoaded: boolean;
	createdAt: number;
}

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
	console.log('🚀 初始化会话:', session.id);

	// 1. 获取init-session系统提示词
	if (!session.systemPromptLoaded) {
		try {
			const systemPrompt = await mcpClient.initializeSession(language);
			session.messages.unshift({
				role: 'system',
				content: systemPrompt
			});
			session.systemPromptLoaded = true;
			console.log('✅ 系统提示词已加载，长度:', systemPrompt.length, '字符');
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
			console.log('✅ 工具列表已加载，工具数量:', session.tools.length);
		} catch (error) {
			console.error('❌ 工具列表加载失败:', error);
			throw new Error('Failed to load tools');
		}
	}
}

/**
 * 调用OpenAI API
 */
async function callOpenAI(messages: OpenAIMessage[], tools: OpenAITool[]): Promise<OpenAIResponse> {
	// 从环境变量获取配置
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
	const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
	const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

	if (!apiKey) {
		console.warn('⚠️  未配置OpenAI API密钥');
		throw new Error('未配置OpenAI API密钥');
	}

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

		const response = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
			);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('❌ OpenAI API调用失败', error);
		throw error;
	}
}

/**
 * 处理工具调用响应
 */
async function handleToolCalls(
	session: ConversationSession,
	assistantMessage: OpenAIMessage
): Promise<{ nluiConfig?: any; uiUrl?: string }> {
	if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
		return {};
	}

	// 添加助手消息到会话历史（包含工具调用）
	session.messages.push(assistantMessage);

	let uiUrl: string | undefined;

	// 执行所有工具调用
	for (const toolCall of assistantMessage.tool_calls) {
		try {
			console.log('🔧 执行工具调用:', toolCall);

			const args = JSON.parse(toolCall.function.arguments);
			const result = await mcpClient.callTool(toolCall.function.name, args);

			console.log('✅ 工具调用成功:', result);

			// 添加工具响应消息（简化内容，只保留必要信息）
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
				console.log('🎨 UI组件已生成，URL:', uiUrl);
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
	language = 'zh'
): Promise<{
	response: string;
	nluiConfig?: any;
	uiUrl?: string;
	meta: {
		timestamp: string;
		usedTools: boolean;
		model: string;
		finishReason: string;
	};
}> {
	console.log('🤖 开始处理对话');
	console.log('📝 用户输入:', userMessage);

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
		console.log('� 会话消息数量:', session.messages.length);
		console.log('�️  可用工具数量:', session.tools.length);

		const startTime = Date.now();
		console.log('⏳ ==============\n消息体:\n', JSON.stringify(session.messages, null, 2));
		console.log('⏳ ==============\t工具集:\n', JSON.stringify(session.tools, null, 2));
		const result = await callOpenAI(session.messages, session.tools);
		console.log('⏳ ==============\n响应体:\n', JSON.stringify(result, null, 2));
		const endTime = Date.now();
		const responseTime = endTime - startTime;

		console.log('✅ OpenAI API调用成功');
		console.log('⏱️  响应时间:', responseTime, 'ms');

		const choice = result.choices[0];
		const assistantMessage = choice.message;
		let uiUrl: string | undefined;

		// 检查是否有工具调用
		if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls) {
			console.log('🔧 检测到工具调用，数量:', assistantMessage.tool_calls.length);

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
		console.error('❌ 对话处理失败:', error);
		throw error;
	}
}

/**
 * 重置会话
 */
export function resetSessionClient(sessionId: string): void {
	sessions.delete(sessionId);
	console.log('🔄 会话已重置:', sessionId);
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
