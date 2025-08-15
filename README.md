# NLUI-MCP: 自然语言用户界面

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-cyan.svg)](https://tailwindcss.com/)

> 🚀 **NLUI-MCP** 是一个基于自然语言处理的用户界面框架，旨在通过大语言模型设计，实现自然语言交互来简化用户与计算机系统的交互方式。

## ✨ 特性

- 🎯 **自然语言驱动**: 通过自然语言描述生成动态UI组件
- 🔧 **模型上下文协议 (MCP)**: 集成MCP SDK，支持与AI模型的高效通信
- 🎨 **现代化设计**: 基于 SvelteKit 5.x + TailwindCSS 4.x + FlyonUI 的现代化技术栈
- 🌍 **多语言支持**: 内置中英文双语支持 (Inlang + Paraglide.js)
- 📱 **响应式布局**: 支持多区域自适应布局（头部、底部、侧边栏、主内容区）
- 🧩 **丰富组件**: 内置卡片、表格、表单、列表、警告等常用UI组件
- ⚡ **类型安全**: 完整的 TypeScript 支持和 Zod 验证
- 🎭 **主题切换**: 支持明暗主题切换

## 🏗️ 架构概览

```
NLUI-MCP Framework
├── 🎨 前端界面 (SvelteKit + TypeScript)
│   ├── 组件渲染引擎
│   ├── 布局管理系统
│   └── 多语言支持
├── 🔧 MCP 服务器
│   ├── 自然语言处理
│   ├── UI配置生成
│   └── 组件模式验证
└── 📊 类型系统
    ├── JSON Schema 生成
    ├── TypeScript 类型定义
    └── 运行时验证
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/ideal-world/nlui-mcp.git
cd nlui-mcp

# 安装依赖
pnpm install
```

### 开发运行

```bash
# 启动开发服务器
pnpm dev

# 访问应用
# http://localhost:5173
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📖 使用指南

### 基本用法

NLUI 支持两种配置方式：

#### 1. URL 参数传递

```url
http://localhost:5173?sessionId=demo&nlui=%7B%22block%22%3A%7B%22main%22%3A%7B%22kind%22%3A%22card%22%2C%22cardProps%22%3A%7B%22title%22%3A%22欢迎%22%2C%22body%22%3A%22这是一个示例卡片%22%7D%7D%7D%7D
```

#### 2. SessionStorage 存储

```javascript
// 保存配置到 sessionStorage
const config = {
  block: {
    main: {
      kind: 'card',
      cardProps: {
        title: '欢迎使用 NLUI',
        body: '这是一个基于自然语言的用户界面框架'
      }
    }
  },
  showTools: true,
  showDebug: false
};

sessionStorage.setItem('nluiProp_demo', JSON.stringify(config));
```

### 组件类型

NLUI 支持多种内置组件：

| 组件类型 | 说明     | 示例用途           |
| -------- | -------- | ------------------ |
| `card`   | 卡片组件 | 信息展示、产品介绍 |
| `table`  | 表格组件 | 数据列表、统计表格 |
| `form`   | 表单组件 | 用户输入、数据收集 |
| `list`   | 列表组件 | 项目列表、菜单导航 |
| `alert`  | 警告组件 | 提示信息、状态通知 |

### 布局系统

NLUI 采用 5 区域布局模式：

```typescript
interface NLUIBlock {
  main: NLUIComponent | NLUIBlock; // 主内容区（必需）
  header?: NLUIComponent | NLUIBlock; // 头部区域
  footer?: NLUIComponent | NLUIBlock; // 底部区域
  left?: NLUIComponent | NLUIBlock; // 左侧边栏
  right?: NLUIComponent | NLUIBlock; // 右侧边栏
}
```

## 🎯 实际案例

### 案例 1: 员工信息表格

```typescript
const employeeTable = {
  block: {
    main: {
      kind: 'table',
      tableProps: {
        caption: '员工信息管理',
        columns: [
          { key: 'name', label: '姓名', type: 'text' },
          { key: 'email', label: '邮箱', type: 'text' },
          { key: 'position', label: '职位', type: 'text' },
          { key: 'department', label: '部门', type: 'text' }
        ],
        data: [
          {
            name: '张三',
            email: 'zhang@example.com',
            position: '前端工程师',
            department: '技术部'
          },
          { name: '李四', email: 'li@example.com', position: '后端工程师', department: '技术部' }
        ]
      }
    }
  },
  showTools: true
};
```

### 案例 2: 产品展示卡片

```typescript
const productCard = {
  block: {
    main: {
      kind: 'card',
      cardProps: {
        title: 'iPhone 15 Pro',
        body: '搭载 A17 Pro 芯片，支持 Action Button，配备 48MP 主摄像头',
        footer: '￥7999 起',
        primaryAction: {
          label: '立即购买',
          onClickLink: '/buy'
        }
      }
    }
  }
};
```

### 案例 3: 复合布局界面

```typescript
const dashboardLayout = {
  block: {
    header: {
      kind: 'card',
      cardProps: {
        title: '控制台',
        body: '欢迎回来！'
      }
    },
    left: {
      kind: 'list',
      listProps: {
        items: [{ content: '首页' }, { content: '数据分析' }, { content: '用户管理' }]
      }
    },
    main: {
      kind: 'table',
      tableProps: {
        caption: '最新数据'
        // ... 表格配置
      }
    },
    right: {
      kind: 'alert',
      alertProps: {
        type: 'info',
        message: '系统运行正常'
      }
    }
  },
  showTools: true
};
```

## 🔧 开发指南

### 项目结构

```
src/
├── lib/
│   ├── components/          # Svelte 组件
│   ├── server/             # MCP 服务器
│   │   ├── mcpServer.ts    # MCP 服务器实现
│   │   └── generated/      # 自动生成的模式
│   ├── ui/                 # UI 组件类型定义
│   │   ├── components/     # 各组件类型
│   │   └── nluiProp.types.ts
│   └── client/             # 客户端工具
├── routes/                 # SvelteKit 路由
├── paraglide/             # 国际化消息
└── messages/              # 语言文件
```

### 添加新组件

1. **定义类型**：在 `src/lib/ui/components/` 中创建类型文件

```typescript
// mycomponent.types.ts
export interface NLUIMyComponentProps extends BaseComponentProps {
  title: string;
  content: string;
}
```

2. **实现组件**：创建 Svelte 组件

```svelte
<!-- mycomponent.svelte -->
<script lang="ts">
  import type { NLUIMyComponentProps } from './mycomponent.types';
  let { title, content }: NLUIMyComponentProps = $props();
</script>

<div class="my-component">
  <h3>{title}</h3>
  <p>{content}</p>
</div>
```

3. **注册组件**：在 `ComponentRenderer.svelte` 中添加渲染逻辑

4. **生成模式**：运行 `pnpm run generate:schemas` 更新 JSON Schema

### 国际化

添加新的多语言文本：

```json
// messages/zh.json
{
  "my_new_key": "中文文本"
}

// messages/en.json
{
  "my_new_key": "English text"
}
```

在组件中使用：

```svelte
<script>
  import * as m from '../paraglide/messages';
</script>

<p>{m.my_new_key()}</p>
```

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 监听模式测试
pnpm test:unit

# 类型检查
pnpm check

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 📚 API 参考

### MCP 服务器工具

| 工具名称        | 描述                     | 参数                 |
| --------------- | ------------------------ | -------------------- |
| `init-session`  | 初始化会话系统提示       | `language?: string`  |
| `nlui-generate` | 生成 NLUI 配置和渲染 URL | `nluiProp: NLUIProp` |

### 核心类型

- **NLUIProp**: 根配置接口
- **NLUIBlock**: 布局块接口
- **NLUIComponent**: 组件接口
- **NLUIComponentKind**: 组件类型枚举

详细的类型定义请参考 `src/lib/ui/nluiProp.types.ts`。

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读以下指南：

1. **Fork** 本仓库
2. **创建** 功能分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **开启** Pull Request

### 开发规范

- 使用 TypeScript 进行严格类型检查
- 遵循 ESLint 和 Prettier 配置
- 为新功能添加测试用例
- 更新相关文档

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

感谢以下开源项目的支持：

- [SvelteKit](https://kit.svelte.dev/) - 全栈 Web 框架
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [FlyonUI](https://flyonui.com/) - UI 组件库
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI 模型通信协议
- [Inlang](https://inlang.com/) - 国际化工具链
