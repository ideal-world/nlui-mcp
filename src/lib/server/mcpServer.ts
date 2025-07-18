import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';
import { ErrorHandler } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { formatSchemaAsDocumentation } from './dynamicTypeGenerator';
import { nluiSchemas } from './generated/schemas';

/**
 * 创建NLUI MCP服务器实例
 * Create NLUI MCP Server instance
 */
const server = new McpServer({
	name: 'nlui-mcp-server',
	version: '1.0.0'
});

// 记录服务器启动
logger.info('NLUI MCP Server starting', {
	component: 'MCPServer',
	action: 'startup',
	metadata: {
		serverName: 'nlui-mcp-server',
		version: '1.0.0'
	}
});

/**
 * 生成中文系统提示
 * Generate Chinese system prompt
 */
function generateSystemPromptZH(): string {
	logger.debug('Generating Chinese system prompt', {
		component: 'MCPServer',
		action: 'generatePrompt'
	});

	return `# NLUI MCP 系统初始化

您现在连接到 NLUI (Natural Language User Interface) MCP 服务器。

## 🎯 服务能力
我是一个专业的UI配置生成助手，可以帮助您：
1. **智能响应判断**: 根据用户需求智能判断是否需要生成UI组件或提供文本回复
2. **UI 配置生成**: 根据自然语言描述生成符合 NLUI 规范的 UI 配置

## 🛠️ 可用工具

### ui-render
**功能**: 根据 NLUIProps 配置生成渲染界面的URL
**使用时机**: 当用户需求适合用UI组件展示时调用此工具
**说明**: 该工具接受符合 NLUI 规范的配置对象，并生成可访问的交互式界面

## 🔄 智能响应策略（重要）

### 情况1 - 必须返回纯文本回答（不调用任何工具）：
- **概念性问答**: "什么是OpenAI API"、"如何使用"、"为什么"等询问
- **简单问候语**: "你好"、"hi"、"hello"等
- **技术解释**: 需要详细说明或教程的请求
- **一般性对话**: 天气、感受、建议等闲聊
- **感谢用语**: "谢谢"、"不客气"、"再见"等

### 情况2 - 必须使用ui-render工具生成界面：
- **明确的表格需求**: 整理统计表格、显示员工信息表格等
- **数据展示需求**: 显示统计数据、创建报告、展示列表等
- **表单界面需求**: 创建注册表单、设计登录界面等
- **卡片展示需求**: 创建产品卡片、显示信息卡等
- **提示信息需求**: 显示成功提示、创建警告框等
- **包含具体数据字段的请求**: 用户指定了要显示的具体字段或数据

## ⚡ 关键决策规则

**判断标准**：
1. 用户是否要求展示具体的数据或信息？→ 使用ui-render工具
2. 用户是否使用了"显示"、"创建"、"生成"、"整理"等动作词？→ 使用ui-render工具
3. 用户是否在询问概念、原理或寻求解释？→ 直接文本回答
4. 用户的需求是否可以用表格、卡片、列表等组件更好地展示？→ 使用ui-render工具

**示例分析**：
- ❌ "什么是OpenAI API" → 文本回答（概念询问）
- ✅ "整理一份OpenAI API的表格，包含常用参数" → ui-render工具（明确的表格需求）
- ❌ "OpenAI API怎么使用" → 文本回答（使用教程）
- ✅ "显示OpenAI API参数列表" → ui-render工具（数据展示需求）

## 💡 执行指南

**当使用ui-render工具时**：
1. 根据用户需求选择最合适的组件类型（table、card、form、list、alert）
2. 提供真实、详细的数据内容，避免占位符
3. 确保配置完整且符合NLUI规范
4. 配置合理的组件属性和样式

**当直接文本回答时**：
- 提供清晰、准确的解释或回答
- 不要提及或建议使用UI组件

准备就绪！我将根据您的需求智能选择最合适的响应方式。`;
}

/**
 * Session initialization prompt - provides system context and available tools
 */
server.prompt(
	'init-session',
	'初始化会话系统提示 / Initialize session system prompt',
	{
		language: z.string().optional()
	},
	async ({ language = 'zh' }) => {
		const startTime = Date.now();

		logger.info('Session initialization requested', {
			component: 'MCPServer',
			action: 'initSession',
			metadata: { language }
		});

		try {
			// TODO
			const systemPrompt = generateSystemPromptZH();

			const result = {
				messages: [
					{
						role: 'user' as const,
						content: {
							type: 'text' as const,
							text: systemPrompt
						}
					}
				]
			};

			const duration = Date.now() - startTime;
			logger.info('Session initialization completed', {
				component: 'MCPServer',
				action: 'initSession',
				duration,
				metadata: { language, promptLength: systemPrompt.length }
			});

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			const handledError = ErrorHandler.handle(error, {
				component: 'MCPServer',
				action: 'initSession',
				duration,
				metadata: { language }
			});

			throw handledError.originalError;
		}
	}
);

/**
 * UI组件渲染工具
 * UI component rendering tool
 */
server.tool(
	'ui-render',
	`根据NLUIProps配置生成渲染界面的URL / Generate UI rendering URL based on NLUIProps configuration

该工具接受符合NLUI规范的配置对象，并生成可访问的交互式Web界面。

## 格式要求

输入配置必须严格符合以下JSON Schema:

${formatSchemaAsDocumentation('NLUIProps', nluiSchemas.NLUIProps)}

## 示例配置:

{
  "nluiProps": {
    "block": {
      "main": {
        "kind": "card",
        "cardProps": {
          "title": "示例标题",
          "body": "这是一个示例内容"
        }
      }
    },
    "showTools": false,
    "showDebug": false
  }
}
  
{
  "nluiProps": {
    "block": {
      "main": {
        "kind": "table",
        "tableProps": {
          "caption": "示例标题",
          "columns": [
            { "key": "name", "title": "姓名", "sortable": true },
            { "key": "email", "title": "邮箱", "align": "right", "sortable": true },
            { "key": "role", "title": "角色", "align": "center" }
          ],
          "rows": [
            {
              "id": 1,
              "data": { "name": "iPhone 15", "email": "zhang@example.com", "role": "管理员" },
              "actions": [{ "label": "查看", "onClickLink": "/products/1" }]
            }
          ],
          "striped": true
        }
      }
    },
    "showTools": true,
    "showDebug": false
  }
}`,
	{
		nluiProps: z.object({
			block: z.record(z.any()),
			showTools: z.boolean().optional(),
			showDebug: z.boolean().optional()
		})
	},
	async (args) => {
		const startTime = Date.now();

		logger.info('UI component rendering requested', {
			component: 'MCPServer',
			action: 'renderUIComponent',
			metadata: args
		});

		try {
			// 验证NLUI属性 (基本验证)
			if (!args.nluiProps) {
				throw ErrorHandler.createValidationError('nluiProps 必须是一个有效的对象');
			}

			// 编码NLUIProps配置
			const encodedNLUIProps = encodeURIComponent(JSON.stringify(args.nluiProps));

			// 生成URL
			const baseUrl = process.env.NLUI_BASE_URL || 'http://localhost:5173';
			const url = `${baseUrl}?nlui=${encodedNLUIProps}`;

			// 构建渲染结果
			const result: CallToolResult = {
				content: [
					{
						type: 'resource' as const,
						resource: {
							uri: url,
							text: `NLUI Interactive Interface: Generated UI interface based on provided configuration`,
							mimeType: 'text/html'
						}
					}
				]
			};

			const duration = Date.now() - startTime;
			logger.info('UI component rendering completed', {
				component: 'MCPServer',
				action: 'renderUIComponent',
				duration,
				metadata: {
					success: true,
					resultSize: JSON.stringify(result).length
				}
			});

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			const handledError = ErrorHandler.handle(error, {
				component: 'MCPServer',
				action: 'renderUIComponent',
				duration,
				metadata: args
			});

			// 返回错误信息给客户端
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								type: 'error',
								message: handledError.getUserMessage(),
								timestamp: new Date().toISOString()
							},
							null,
							2
						)
					}
				]
			};
		}
	}
);

/**
 * 启动服务器
 * Start the server
 */
export async function startServer(transport?: any): Promise<void> {
	try {
		if (transport) {
			await server.connect(transport);
		}

		logger.info('NLUI MCP Server started successfully', {
			component: 'MCPServer',
			action: 'startup',
			metadata: { status: 'connected', hasTransport: !!transport }
		});
	} catch (error) {
		const handledError = ErrorHandler.handle(error, {
			component: 'MCPServer',
			action: 'startup'
		});

		logger.error('Failed to start NLUI MCP Server', handledError.originalError, {
			component: 'MCPServer',
			action: 'startup',
			metadata: { status: 'failed' }
		});

		throw handledError.originalError;
	}
}

/**
 * 停止服务器
 * Stop the server
 */
export async function stopServer(): Promise<void> {
	try {
		await server.close();

		logger.info('NLUI MCP Server stopped successfully', {
			component: 'MCPServer',
			action: 'shutdown',
			metadata: { status: 'closed' }
		});
	} catch (error) {
		const handledError = ErrorHandler.handle(error, {
			component: 'MCPServer',
			action: 'shutdown'
		});

		logger.error('Error stopping NLUI MCP Server', handledError.originalError, {
			component: 'MCPServer',
			action: 'shutdown',
			metadata: { status: 'error' }
		});

		throw handledError.originalError;
	}
}

export { server };
export default server;
