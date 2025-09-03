import { generateUUID } from '$lib/utils';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';
import { ErrorHandler } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { formatSchemaAsDocumentation } from './dynamicTypeGenerator';
import { nluiSchemas } from './generated/schemas';

/**
 * 内存存储，用于保存NLUIProps配置
 * In-memory storage for NLUIProps configurations
 */
const nluiPropsStorage = new Map<string, any>();

/**
 * 清理过期的存储项（24小时后过期）
 * Clean up expired storage items (expires after 24 hours)
 */
const storageMetadata = new Map<string, { timestamp: number }>();
const STORAGE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanupExpiredStorage() {
  const now = Date.now();
  for (const [instanceId, metadata] of storageMetadata.entries()) {
    if (now - metadata.timestamp > STORAGE_EXPIRY_MS) {
      nluiPropsStorage.delete(instanceId);
      storageMetadata.delete(instanceId);
      logger.debug('Cleaned up expired storage item', {
        component: 'MCPServer',
        action: 'cleanupStorage',
        metadata: { instanceId }
      });
    }
  }
}

// 定期清理过期项
setInterval(cleanupExpiredStorage, 60 * 60 * 1000); // 每小时清理一次

/**
 * 存储NLUIProps配置并返回instanceId
 * Store NLUIProps configuration and return instanceId
 */
export function storeNLUIProps(nluiProps: any): string {
  const instanceId = generateUUID();
  nluiPropsStorage.set(instanceId, nluiProps);
  storageMetadata.set(instanceId, { timestamp: Date.now() });

  logger.debug('Stored NLUIProps configuration', {
    component: 'MCPServer',
    action: 'storeNLUIProps',
    metadata: { instanceId, storageSize: nluiPropsStorage.size }
  });

  return instanceId;
}

/**
 * 根据instanceId获取NLUIProps配置
 * Get NLUIProps configuration by instanceId
 */
export function getNLUIPropsById(instanceId: string): any | null {
  const nluiProps = nluiPropsStorage.get(instanceId);

  if (nluiProps) {
    logger.debug('Retrieved NLUIProps configuration', {
      component: 'MCPServer',
      action: 'getNLUIPropsById',
      metadata: { instanceId, found: true }
    });
    return nluiProps;
  } else {
    logger.warn('NLUIProps configuration not found', {
      component: 'MCPServer',
      action: 'getNLUIPropsById',
      metadata: { instanceId, found: false }
    });
    return null;
  }
}

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

您现在连接到 NLUI (Natural Language User Interface) MCP 服务器 - 一个强大的自然语言UI生成系统。

## 核心能力
我是您的专业UI配置生成助手，具备以下核心能力：

### 1. 智能响应判断
- 智能分析用户需求，判断是否需要生成UI组件
- 区分概念性问答与UI生成需求
- 提供恰当的响应类型

### 2. 丰富的UI组件支持
支持以下11种专业UI组件，以及强大的5区域布局系统：

** 布局系统**
- **5区域布局**: 支持 header、footer、left、right、main 五个区域的灵活组合
- **无限嵌套**: main 区域可以包含另一个完整的布局结构，支持复杂的页面组织
- **响应式设计**: 自动适配不同屏幕尺寸，提供最佳的用户体验
- **智能布局**: 根据内容类型智能推荐合适的布局结构

** 内容展示组件**
- **卡片组件 (Card)**: 展示结构化信息，支持图片、标题、内容和操作按钮
- **表格组件 (Table)**: 功能完整的数据表格，支持排序、搜索、分页和行操作
- **Markdown组件**: 渲染Markdown内容，支持代码高亮和丰富文本格式

** 数据收集组件**  
- **表单组件 (Form)**: 全功能表单，支持多种输入类型、验证和自定义布局

** 数据可视化组件**
- **图表组件 (Chart)**: 基于ApexCharts，支持折线图、柱状图、饼图等多种图表类型
- **时间轴组件 (Timeline)**: 展示按时间排序的事件，支持状态标识

** 日程管理组件**
- **日历组件 (Calendar)**: 基于FullCalendar，支持月视图、周视图和事件管理

**媒体展示组件**
- **画廊组件 (Gallery)**: 图片和视频轮播展示，支持缩略图导航
- **图片组件 (Image)**: 优化的图片展示，支持响应式和懒加载
- **视频组件 (Video)**: 视频播放器，支持多种格式和控制选项
- **音频组件 (Audio)**: 音频播放器，提供标准播放控制

## 可用工具

### ui-render
**功能**: 根据用户需求生成交互式UI界面
**输入**: 符合NLUI规范的JSON配置
**输出**: 可访问的界面URL，用户可直接查看和交互

## 智能响应决策系统

### 情况判断规则

**纯文本回答场景** (不调用任何工具):
- **概念性问答**: "什么是..."、"如何理解..."、"为什么..."
- **技术解释**: 需要详细说明、教程、原理解释
- **闲聊对话**: 问候语、感谢、天气、感受分享
- **抽象建议**: 不涉及具体数据展示的建议和意见

** UI生成场景** (必须使用ui-render工具):
- **布局设计**: 企业系统布局、仪表盘、网站框架、多区域页面结构
- **数据展示需求**: 显示表格、列表、统计数据
- **信息卡片**: 产品展示、人员信息、项目概览
- **表单界面**: 注册、登录、调查问卷、数据录入
- **图表需求**: 数据可视化、趋势分析、报告展示  
- **日程安排**: 日历视图、事件安排、时间轴
- **媒体展示**: 图片库、视频播放、音频内容
- **内容发布**: Markdown文档、富文本展示

### 决策关键词识别

**UI生成触发词**:
- 动作类: "显示"、"创建"、"生成"、"制作"、"展示"、"设计"、"构建"、"搭建"
- 组件类: "表格"、"卡片"、"表单"、"图表"、"列表"、"画廊"
- 布局类: "布局"、"页面"、"界面"、"仪表盘"、"系统"、"框架"、"结构"
- 区域类: "导航"、"侧边栏"、"头部"、"底部"、"主区域"、"左侧"、"右侧"
- 数据类: "统计"、"报告"、"信息"、"数据"、"内容"

### 智能组件选择策略

**内容分析与组件映射原理**:
- **数据类型识别**: 分析用户描述的数据性质（列表、层级、时序、媒体等）
- **交互需求分析**: 理解用户对数据的操作需求（查看、编辑、筛选、对比等）
- **信息架构评估**: 确定信息的复杂程度和展示优先级
- **用户场景推导**: 从描述中推断实际使用场景和用户行为模式

**通用组件选择规则**:
1. **Table组件** 适用于：
   - 结构化数据展示（行列格式）
   - 需要排序、筛选、搜索的数据集
   - 多属性对象的列表展示
   - 数据对比和分析需求

2. **Card组件** 适用于：
   - 独立信息单元的展示
   - 图文混合内容
   - 突出重点信息的场景
   - 需要快速浏览的内容集合

3. **Chart组件** 适用于：
   - 数值数据的可视化分析
   - 趋势、比例、分布关系展示
   - 需要直观理解数据模式的场景

4. **Timeline组件** 适用于：
   - 时间序列事件展示
   - 流程步骤说明
   - 历史记录和进度跟踪

5. **Form组件** 适用于：
   - 数据收集和录入
   - 用户交互和配置设置
   - 反馈提交和调查问卷

6. **Gallery/Image/Video/Audio组件** 适用于：
   - 媒体内容展示
   - 视觉化信息传达
   - 产品展示和宣传

7. **Markdown组件** 适用于：
   - 文档和说明内容
   - 长文本阅读
   - 格式化文本展示

8. **Calendar组件** 适用于：
   - 时间安排和调度
   - 事件管理和提醒
   - 日程规划展示

**通用布局选择原理**:
- **信息层次分析**: 根据内容重要性和用户关注度确定区域分配
- **功能分组**: 将相关功能和信息组织在同一区域
- **视觉平衡**: 确保界面布局的视觉协调和用户体验
- **响应式考虑**: 保证不同设备上的良好展示效果

**智能布局推荐规则**:
1. **单一内容焦点**: main区域单组件展示
2. **双重信息结构**: main + side（left或right）的组合
3. **三层信息架构**: header + main + footer的垂直结构
4. **四区域功能分离**: header + left + main + right的完整布局
5. **五区域复杂系统**: 完整的header + left + main + right + footer结构

## 最佳实践指南

### 生成高质量UI的要点:
1. **明确组件类型**: 根据用户需求选择最合适的组件
2. **丰富数据内容**: 提供真实、有意义的示例数据
3. **优化用户体验**: 合理设置交互功能和视觉样式
4. **保持一致性**: 遵循设计规范和命名约定
5. **考虑响应式**: 确保组件在不同设备上的良好表现

### 生成策略:
- **主动理解**: 深入理解用户真实需求，不仅仅是字面意思
- **智能推荐**: 基于使用场景推荐最佳组件组合
- **数据丰富**: 生成有意义的示例数据，而非空白模板
- **交互完整**: 确保生成的界面具备完整的交互功能
- **布局优先**: 对于复杂界面需求，优先考虑使用布局系统组织内容

### 布局设计原则:
- **内容驱动**: 根据要展示的具体内容选择合适的布局结构，而非先定义布局再填充内容
- **功能导向**: 分析用户的实际业务需求，将相关功能组织在合理的区域
- **信息层次**: header放置导航/标题，main放置核心业务内容，sidebars放置辅助信息和工具
- **业务逻辑**: 按照用户的工作流程和业务逻辑组织界面元素
- **用户体验**: 考虑用户浏览习惯和交互流程，确保信息获取的便捷性
- **响应式优先**: 确保在不同设备上的良好展示效果

### 通用布局选择策略:
**基于内容复杂度的布局决策**:
1. **简单内容** (单一信息类型)
   - 使用 main 区域的单组件布局
   - 适合：单个表格、图表、表单等

2. **中等复杂度** (2-3种信息类型)
   - 使用 main + sidebar 的二区域布局
   - 适合：主内容 + 导航/工具，详情 + 列表等

3. **复杂内容** (多种信息类型)
   - 使用 header + main + sidebar(s) 的三区域布局
   - 适合：系统界面、仪表板等

4. **企业级复杂度** (多层级信息架构)
   - 使用完整的五区域布局系统
   - 适合：管理系统、综合平台等

**基于用户行为的布局优化**:
- **浏览型**: 强调视觉展示，使用gallery、card组合
- **分析型**: 重点数据可视化，chart + table组合
- **操作型**: 突出功能入口，form + card组合
- **管理型**: 全面信息展示，多区域布局组合

### 动态布局适配原理:
- **内容感知**: 根据描述的内容特征自动选择合适组件
- **场景识别**: 从用户描述中识别使用场景和目标
- **优先级排序**: 确定信息展示的重要性优先级
- **空间规划**: 合理分配屏幕空间给不同类型的内容

## 专业建议

当用户需求不明确时，我会：
1. 主动询问具体要求和使用场景
2. 提供多种可能的解决方案
3. 推荐最适合的组件类型
4. 建议合适的布局结构
5. 生成高质量的示例界面

准备就绪！我将根据您的需求智能判断响应类型，为数据展示需求生成专业的UI界面，为概念问题提供详细解答。请告诉我您需要什么帮助？`;
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
}

{
  "nluiProps": {
    "block": {
      "main": {
        "kind": "calendar",
        "calendarProps": {
          "title": "项目日程安排",
          "config": {
            "initialView": "dayGridMonth",
            "headerToolbar": {
              "left": "prev,next today",
              "center": "title",
              "right": "dayGridMonth,timeGridWeek"
            },
            "height": 600
          },
          "events": [
            {
              "id": "1",
              "title": "项目启动会议",
              "start": "2025-08-15T10:00:00",
              "end": "2025-08-15T11:30:00",
              "classNames": ["fc-event-primary"]
            },
            {
              "id": "2",
              "title": "项目截止日期",
              "start": "2025-08-30",
              "allDay": true,
              "classNames": ["fc-event-error"]
            }
          ]
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
        "kind": "gallery",
        "galleryProps": {
          "title": "产品展示画廊",
          "items": [
            {
              "id": 1,
              "src": "https://cdn.flyonui.com/fy-assets/components/carousel/image-22.png",
              "caption": "高端游戏设备"
            },
            {
              "id": 2,
              "src": "https://cdn.flyonui.com/fy-assets/components/carousel/image-15.png",
              "caption": "VR体验盒子"
            },
            {
              "id": 3,
              "src": "https://cdn.flyonui.com/fy-assets/components/carousel/image-16.png", 
              "caption": "高性能笔记本电脑"
            }
          ]
        }
      }
    },
    "showTools": false,
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

      // 存储nluiProps配置并获取instanceId
      const instanceId = storeNLUIProps(args.nluiProps);

      // 生成包含instanceId的短URL
      const baseUrl = process.env.NLUI_BASE_URL || 'http://localhost:5173';
      const url = `${baseUrl}?instanceId=${instanceId}`;

      // 构建渲染结果
      const result: CallToolResult = {
        content: [
          {
            type: 'resource' as const,
            resource: {
              uri: url,
              text: `NLUI Interactive Interface: Generated UI interface with instance ID ${instanceId}`,
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
