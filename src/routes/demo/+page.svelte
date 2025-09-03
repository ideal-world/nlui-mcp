<script lang="ts">
  import * as m from '../../paraglide/messages';
  import { getSessionInfoClient, processConversationClient, resetSessionClient } from './clientConversationService';

  let userInput = $state('');
  let messages = $state<
    Array<{
      role: 'user' | 'assistant';
      content: string;
      uiUrl?: string;
      timestamp: number;
      meta?: any;
    }>
  >([]);
  let isLoading = $state(false);
  let currentSessionId = $state('demo_session');
  let sessionInfo = $state<{
    exists: boolean;
    messageCount: number;
    systemPromptLoaded: boolean;
    toolsLoaded: boolean;
    toolsCount: number;
  }>({
    exists: false,
    messageCount: 0,
    systemPromptLoaded: false,
    toolsLoaded: false,
    toolsCount: 0
  });

  // iframe加载状态管理
  let iframeLoadingStates = $state<Record<number, boolean>>({});

  // iframe高度管理
  let iframeHeights = $state<Record<number, number>>({});

  // 对话区域引用，用于自动滚动
  let messagesContainer = $state<HTMLDivElement>();

  // 示例用户查询 - 分类组织
  const exampleCategories = [
    {
      title: '布局系统',
      icon: '🏗️',
      examples: [
        '展示企业管理系统，包含员工信息、销售数据、项目进展和系统状态',
        '创建人力资源仪表板，显示招聘进度、员工考勤、绩效评估和培训计划',
        '生成财务管理界面，展示收支报表、预算分析、成本控制和资金流向',
        '设计客户服务平台，包含工单处理、客户信息、服务记录和满意度调查',
        '构建电商运营中心，显示商品管理、订单处理、库存状态和营销数据'
      ]
    },
    {
      title: '数据展示',
      icon: '📊',
      examples: [
        '显示员工信息表格，包含姓名、邮箱、职位、部门字段',
        '创建2024年销售业绩图表，显示月度趋势',
        '生成项目进度时间轴，包含设计、开发、测试、发布阶段',
        '整理技术岗位薪资对比表，包含前端、后端、全栈职位',
        '显示用户反馈统计饼图，按满意度分类'
      ]
    },
    {
      title: '内容展示',
      icon: '📝',
      examples: ['创建iPhone 15 Pro产品展示卡片，包含规格和价格', '生成团队成员介绍卡片，包含照片和职责', '创建API使用指南的Markdown文档', '展示公司发展历程时间轴', '设计产品功能特色卡片组']
    },
    {
      title: '表单交互',
      icon: '📋',
      examples: ['设计用户注册表单，包含验证和必填项', '创建客户反馈收集表单，支持多种输入类型', '生成活动报名表单，包含个人信息和选择项', '设计简洁的联系我们表单', '创建产品订购表单，包含数量和规格选择']
    },
    {
      title: '媒体内容',
      icon: '🖼️',
      examples: ['创建产品图片画廊，支持轮播展示', '生成团队活动照片集合', '展示办公环境图片轮播', '创建设计作品集画廊', '显示客户案例图片展示']
    },
    {
      title: '日程安排',
      icon: '📅',
      examples: ['创建团队会议日程安排', '生成项目里程碑日历视图', '显示培训课程时间表', '创建产品发布计划日历', '展示公司活动安排']
    }
  ];

  let selectedCategory = $state('布局系统');
  let currentExamples = $derived(exampleCategories.find((cat) => cat.title === selectedCategory)?.examples || []);

  // 更新会话信息
  function updateSessionInfo() {
    sessionInfo = getSessionInfoClient(currentSessionId);
  }

  // 使用示例查询
  function useExample(query: string) {
    userInput = query;
  }

  // 自动滚动到最后一条消息
  function scrollToBottom() {
    if (messagesContainer) {
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    }
  }

  async function handleSubmit() {
    if (!userInput.trim() || isLoading) return;

    const query = userInput.trim();
    userInput = '';
    isLoading = true;

    // 添加用户消息
    messages = [
      ...messages,
      {
        role: 'user',
        content: query,
        timestamp: Date.now()
      }
    ];

    // 自动滚动到底部
    scrollToBottom();

    try {
      console.log('🚀 开始AI对话请求（客户端）');
      console.log('📝 用户输入:', query);
      console.log('🆔 会话ID:', currentSessionId);

      // 使用客户端对话服务处理消息
      const result = await processConversationClient(currentSessionId, query, 'zh');

      console.log('✅ 对话处理完成');
      console.log('📊 结果摘要:', {
        responseLength: result.response.length,
        uiUrl: !!result.uiUrl,
        usedTools: result.meta.usedTools
      });

      // 添加AI回复消息
      const responseMessage = {
        role: 'assistant' as const,
        content: result.response,
        uiUrl: result.uiUrl,
        timestamp: Date.now(),
        meta: result.meta
      };

      console.log('💬 添加响应消息:', responseMessage);
      messages = [...messages, responseMessage];

      // 更新会话信息
      updateSessionInfo();

      // 自动滚动到底部
      scrollToBottom();

      console.log('✅ 对话处理完成');
    } catch (error) {
      console.error('❌ 处理过程中发生错误:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: `处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now()
      };
      console.log('🚨 添加错误消息:', errorMessage);
      messages = [...messages, errorMessage];

      // 自动滚动到底部
      scrollToBottom();
    } finally {
      console.log('🏁 请求处理结束，设置loading状态为false');
      isLoading = false;
    }
  }

  function resetSession() {
    if (isLoading) return;

    try {
      resetSessionClient(currentSessionId);
      updateSessionInfo();
      messages = [];
      iframeLoadingStates = {}; // 清理iframe加载状态
      iframeHeights = {}; // 清理iframe高度状态
      console.log('🔄 会话已重置');

      // 滚动到顶部
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }
    } catch (error) {
      console.error('❌ 重置会话失败:', error);
    }
  }

  function getIframeUrl(uiUrl: string): string {
    return uiUrl + `&sessionId=${currentSessionId}`;
  }

  function handleIframeLoad(timestamp: number) {
    iframeLoadingStates[timestamp] = false;
  }

  function handleIframeStart(timestamp: number) {
    iframeLoadingStates[timestamp] = true;
  }

  // 调整iframe高度
  function adjustIframeHeight(timestamp: number, delta: number) {
    const currentHeight = iframeHeights[timestamp] || 320;
    const newHeight = Math.max(200, Math.min(800, currentHeight + delta));
    iframeHeights[timestamp] = newHeight;
  }

  // 重置iframe高度
  function resetIframeHeight(timestamp: number) {
    iframeHeights[timestamp] = 320;
  }

  // 页面加载时更新会话信息
  updateSessionInfo();
</script>

<svelte:head>
  <title>{m.app_title()} - {m.demo_title()}</title>
  <meta name="description" content={m.demo_description()} />
</svelte:head>

<div class="bg-base-200 flex h-screen flex-col">
  <div class="flex flex-1 flex-col px-4 py-6">
    <!-- 标题区域 -->
    <div class="mb-6 flex-shrink-0 text-center">
      <h1 class="text-primary mb-2 text-3xl font-bold">{m.demo_title()}</h1>
      <p class="text-base-content/70">{m.demo_description()}</p>
    </div>

    <!-- 对话区域 -->
    <div class="card bg-base-100 flex h-full w-full flex-col shadow-xl">
      <div class="card-body flex h-full flex-col">
        <h2 class="card-title">AI 对话</h2>

        <!-- 消息列表 -->
        <div class="mb-4 min-h-0 flex-1 space-y-4 overflow-y-auto" bind:this={messagesContainer}>
          {#each messages as message}
            <!-- 消息气泡 -->
            <div class="w-full {message.role === 'user' ? 'flex justify-start' : 'flex justify-end'}">
              {#if message.content.trim()}
                <div class="max-w-[80%] rounded-2xl px-4 py-3 {message.role === 'user' ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}">
                  {message.content}
                  {#if message.role === 'assistant' && message.meta}
                    <div class="mt-2 flex items-center gap-2 text-xs opacity-70">
                      <span class="badge badge-xs">🤖 AI</span>
                      {#if message.meta.usedTools}
                        <span class="badge badge-success badge-xs">🛠️ UI已生成</span>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- AI回复的UI界面显示 -->
            {#if message.role === 'assistant' && message.uiUrl}
              <div class="flex w-full justify-end">
                <div class="mt-2 w-[98%]">
                  <!-- 界面信息标题 -->
                  <div class="bg-base-200 mb-2 flex flex-wrap items-center gap-2 rounded-lg p-3">
                    <button class="btn btn-xs btn-outline" onclick={() => window.open(getIframeUrl(message.uiUrl!), '_blank')}> 📱 在新窗口打开 </button>

                    <!-- 高度调整控件 -->
                    <div class="flex items-center gap-1">
                      <button class="btn btn-xs btn-circle btn-outline" title="减小高度" onclick={() => adjustIframeHeight(message.timestamp, -60)}> ➖ </button>
                      <span class="text-xs opacity-70">
                        {iframeHeights[message.timestamp] || 320}px
                      </span>
                      <button class="btn btn-xs btn-circle btn-outline" title="增加高度" onclick={() => adjustIframeHeight(message.timestamp, 60)}> ➕ </button>
                      <button class="btn btn-xs btn-outline" title="重置高度" onclick={() => resetIframeHeight(message.timestamp)}> 🔄 </button>
                    </div>
                  </div>
                  <div class="bg-base-100 border-base-300 relative rounded-lg border p-2 shadow-inner">
                    {#if iframeLoadingStates[message.timestamp] !== false}
                      <!-- 加载状态指示器 -->
                      <div class="bg-base-200/90 absolute inset-2 z-10 flex items-center justify-center rounded">
                        <div class="flex flex-col items-center gap-2">
                          <span class="loading loading-spinner loading-md"></span>
                          <span class="text-base-content/70 text-sm">正在加载界面...</span>
                        </div>
                      </div>
                    {/if}
                    <iframe
                      src={getIframeUrl(message.uiUrl)}
                      class="w-full rounded border-0"
                      style="height: {iframeHeights[message.timestamp] || 320}px; min-height: 200px;"
                      title="Generated UI Component"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      onload={() => handleIframeLoad(message.timestamp)}
                      onloadstart={() => handleIframeStart(message.timestamp)}></iframe>
                  </div>
                </div>
              </div>
            {/if}
          {/each}

          {#if isLoading}
            <div class="flex w-full justify-end">
              <div class="bg-secondary text-secondary-content max-w-[80%] rounded-2xl px-4 py-3">
                <span class="loading loading-dots loading-sm"></span>
                {m.demo_processing()}
              </div>
            </div>
          {/if}
        </div>

        <!-- 会话信息区域 -->
        <div class="bg-base-200 mb-4 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">会话状态:</span>
              <div class="flex items-center gap-1">
                {#if sessionInfo.systemPromptLoaded}
                  <span class="badge badge-success badge-xs">✓ 已初始化</span>
                {:else}
                  <span class="badge badge-warning badge-xs">⏳ 未初始化</span>
                {/if}
                {#if sessionInfo.toolsLoaded}
                  <span class="badge badge-info badge-xs">🛠️ {sessionInfo.toolsCount} 工具</span>
                {:else}
                  <span class="badge badge-neutral badge-xs">⚙️ 工具未加载</span>
                {/if}
                <span class="text-base-content/70 text-xs">
                  {sessionInfo.messageCount} 条消息
                </span>
              </div>
            </div>
            <button class="btn btn-xs btn-outline" onclick={resetSession} disabled={isLoading}> 🔄 重置会话 </button>
          </div>
          <div class="text-base-content/60 mt-1 text-xs">
            会话 ID: {currentSessionId}
            | 基于OpenAI API标准，支持持久化工具定义和智能函数调用
          </div>
        </div>

        <!-- 输入区域 -->
        <form onsubmit={handleSubmit} class="mb-4 flex gap-2">
          <input bind:value={userInput} placeholder={m.demo_input_placeholder()} class="input input-bordered flex-1" disabled={isLoading} />
          <button type="submit" class="btn btn-primary" disabled={!userInput.trim() || isLoading}> {m.demo_send()} </button>
        </form>

        <!-- 示例查询 -->
        <details class="collapse-arrow bg-base-200 collapse">
          <summary class="collapse-title text-sm font-medium">💡 {m.demo_example_queries()}</summary>
          <div class="collapse-content">
            <!-- 分类选择器 -->
            <div class="mb-4 flex flex-wrap gap-2">
              {#each exampleCategories as category}
                <button class="btn btn-sm {selectedCategory === category.title ? 'btn-primary' : 'btn-outline'}" onclick={() => (selectedCategory = category.title)} disabled={isLoading}>
                  {category.icon}
                  {category.title}
                </button>
              {/each}
            </div>

            <!-- 示例查询列表 -->
            <div class="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto">
              {#each currentExamples as query}
                <button class="btn btn-outline btn-sm hover:btn-primary h-auto justify-start py-2 text-left text-xs" onclick={() => useExample(query)} disabled={isLoading}>
                  {query}
                </button>
              {/each}
            </div>

            <!-- 提示信息 -->
            <div class="bg-info/10 mt-3 flex items-start gap-2 rounded-lg p-3 text-xs">
              <span class="text-info">💡</span>
              <div class="text-base-content/70">
                <div class="font-medium">使用提示：</div>
                <ul class="list-inside list-disc space-y-1 text-xs">
                  <li>点击任意示例查询直接发送给AI</li>
                  <li>AI会根据需求智能选择合适的组件类型</li>
                  <li>生成的界面支持交互和在新窗口打开</li>
                  <li>尝试不同类别的示例体验各种组件功能</li>
                </ul>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</div>
