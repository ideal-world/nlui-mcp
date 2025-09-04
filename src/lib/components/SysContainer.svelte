<script lang="ts">
  import type { OpenAIMessage } from '$lib/utils/openAIClient';
  import { jsonrepair } from 'jsonrepair';
  import * as m from '../../paraglide/messages';
  import { processConversationClient } from '../../routes/demo/clientConversationService';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import ThemeSwitcher from './ThemeSwitcher.svelte';
  import UIContainer from './UIContainer.svelte';

  // 对话数据接口
  interface ConversationData {
    id: string;
    title: string;
    nluiProp: any;
    sessionId: string;
    lastActivity: number;
    userInput: string; // 保存用户输入内容
    response?: string; // AI 文字响应
  }

  // 状态管理
  let conversations = $state<ConversationData[]>([]);
  let activeConversationIndex = $state(0);
  let conversationCounter = $state(0);
  let isHistoryOpen = $state(false);
  let isSettingsOpen = $state(false);

  // 对话状态
  let userInput = $state('');
  let isLoading = $state(false);
  let currentError = $state<string | null>(null);

  // 语音识别状态
  let isVoiceRecording = $state(false);
  let voiceSupported = $state(false);
  let recognition: any = null;

  // 获取当前对话 - 使用 derived 状态
  let currentConversation = $derived(conversations.length > 0 && activeConversationIndex >= 0 && activeConversationIndex < conversations.length ? conversations[activeConversationIndex] : null);

  // 获取当前标题显示
  let currentTitle = $derived(() => {
    if (currentConversation?.userInput) {
      // 显示用户输入的前几个字符
      return currentConversation.userInput.length > 10 ? currentConversation.userInput.substring(0, 10) + '...' : currentConversation.userInput;
    }
    return m.sys_container_title();
  });

  // 创建新对话
  function createNewConversation(userInputText: string) {
    conversationCounter++;
    const newConversation: ConversationData = {
      id: `conversation_${conversationCounter}`,
      title: userInputText.length > 10 ? userInputText.substring(0, 10) + '...' : userInputText,
      nluiProp: null,
      sessionId: `sys_session_${Date.now()}_${conversationCounter}`,
      lastActivity: Date.now(),
      userInput: userInputText
    };

    conversations = [...conversations, newConversation];
    activeConversationIndex = conversations.length - 1;
    isHistoryOpen = false;
  }

  // 切换到指定对话
  function switchToConversation(index: number) {
    if (index >= 0 && index < conversations.length) {
      activeConversationIndex = index;
      isHistoryOpen = false;
    }
  }

  // 处理发送消息
  async function handleSendMessage() {
    if (!userInput.trim() || isLoading) return;

    const input = userInput.trim();

    // 每次对话都创建新的对话
    createNewConversation(input);

    userInput = '';
    isLoading = true;
    currentError = null;

    try {
      console.log('🚀 开始处理对话:', { sessionId: currentConversation!.sessionId, input });

      // 使用 demo 中验证过的对话处理方法
      const result = (await processConversationClient(currentConversation!.sessionId, input, 'zh', true)) as OpenAIMessage;

      console.log('✅ 对话处理完成:', result);

      // 更新当前对话的基本信息（文字响应）
      const updatedConversations = [...conversations];
      const conversationIndex = conversations.findIndex((c) => c.id === currentConversation!.id);

      let nluiPropStr = result.tool_calls?.[0]?.function?.arguments!;
      let nluiProp;
      try {
        nluiProp = JSON.parse(nluiPropStr).nluiProps;
      } catch (_e) {
        try {
          nluiProp = JSON.parse(jsonrepair(nluiPropStr)).nluiProps;
        } catch (e) {
          console.error('❌ JSON 解析失败，无法修复:', e);
          throw e;
        }
      }
      updatedConversations[conversationIndex] = {
        ...currentConversation!,
        response: result.content || '',
        nluiProp: nluiProp,
        lastActivity: Date.now()
      };
      conversations = updatedConversations;
    } catch (error) {
      console.error('❌ 对话处理失败:', error);
      currentError = error instanceof Error ? error.message : m.sys_container_processing_error();
    } finally {
      isLoading = false;
    }
  }

  // 清空当前对话
  function clearCurrentChat() {
    if (currentConversation) {
      // 简化重置逻辑，清空所有内容
      const updatedConversations = [...conversations];
      const conversationIndex = conversations.findIndex((c) => c.id === currentConversation.id);
      if (conversationIndex !== -1) {
        updatedConversations[conversationIndex] = {
          ...currentConversation,
          nluiProp: null,
          response: undefined,
          lastActivity: Date.now()
        };
        conversations = updatedConversations;
      }
    }
  }

  // 处理键盘快捷键
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isHistoryOpen = false;
      isSettingsOpen = false;
    }
  }

  // 处理文本框键盘事件
  function handleTextareaKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  // 语音识别功能
  function initVoiceRecognition() {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        userInput = result;
        isVoiceRecording = false;
      };

      recognition.onerror = () => {
        isVoiceRecording = false;
      };

      recognition.onend = () => {
        isVoiceRecording = false;
      };

      voiceSupported = true;
    }
  }

  function toggleVoiceRecording() {
    if (!voiceSupported) {
      alert(m.sys_container_voice_not_supported());
      return;
    }

    if (isVoiceRecording) {
      recognition?.stop();
      isVoiceRecording = false;
    } else {
      recognition?.start();
      isVoiceRecording = true;
    }
  }

  // 初始化
  $effect(() => {
    console.log('SysContainer mounted');

    // 初始化语音识别
    initVoiceRecognition();

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<svelte:head>
  <title>{currentTitle()} - NLUI MCP</title>
</svelte:head>

<div class="bg-base-100 flex h-screen flex-col">
  <!-- 顶部导航栏 -->
  <div class="navbar bg-base-200 border-base-300 relative border-b">
    <div class="navbar-start">
      <!-- 历史对话切换器 - 小一点的按钮 -->
      <div class="dropdown">
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => (isHistoryOpen = !isHistoryOpen)} title={m.sys_container_history()} aria-label={m.sys_container_history()}>
          <span class="icon-[lucide--history] size-4"></span>
        </button>
      </div>
    </div>

    <div class="navbar-center">
      <h1 class="cursor-help text-lg font-semibold" title={currentConversation?.userInput || m.sys_container_title()}>
        {currentTitle()}
      </h1>
    </div>

    <div class="navbar-end gap-2">
      <!-- 清空对话 -->
      <button class="btn btn-ghost btn-sm" onclick={clearCurrentChat} title={m.sys_container_clear_chat()} aria-label={m.sys_container_clear_chat()}>
        <span class="icon-[lucide--trash-2] size-4"></span>
      </button>

      <!-- 语言切换 -->
      <LanguageSwitcher />

      <!-- 主题切换 -->
      <ThemeSwitcher />

      <!-- 设置按钮 -->
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-sm" tabindex="0" onclick={() => (isSettingsOpen = !isSettingsOpen)} title={m.sys_container_settings()} aria-label={m.sys_container_settings()}>
          <span class="icon-[lucide--settings] size-4"></span>
        </button>
      </div>
    </div>
  </div>

  <!-- 历史对话弹出层 - 独立图层 -->
  {#if isHistoryOpen}
    <div class="fixed inset-0 z-50 flex items-start justify-start">
      <!-- 遮罩层 -->
      <div class="fixed inset-0 bg-black/20" onclick={() => (isHistoryOpen = false)} onkeydown={(e) => e.key === 'Escape' && (isHistoryOpen = false)} role="button" tabindex="0" aria-label="关闭历史对话"></div>

      <!-- 对话框 -->
      <div class="bg-base-100 rounded-box border-base-300 relative mt-16 ml-4 max-h-96 w-80 overflow-y-auto border shadow-lg">
        <div class="p-4">
          <h3 class="mb-3 font-semibold">{m.sys_container_history()}</h3>
          {#if conversations.length === 0}
            <div class="text-base-content/60 p-3 text-center text-sm">
              {m.sys_container_empty_state_title()}
            </div>
          {:else}
            <div class="space-y-2">
              {#each conversations as conversation, index}
                <div
                  class="hover:bg-base-200 flex w-full cursor-pointer items-center justify-between rounded-lg p-3 transition-colors"
                  class:bg-primary={index === activeConversationIndex}
                  class:text-primary-content={index === activeConversationIndex}
                  onclick={() => switchToConversation(index)}
                  role="button"
                  tabindex="0"
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      switchToConversation(index);
                    }
                  }}>
                  <div class="flex items-center gap-2">
                    <span class="icon-[lucide--message-circle] size-4"></span>
                    <span class="text-sm font-medium" title={conversation.userInput}>{conversation.title}</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- 设置弹出层 -->
  {#if isSettingsOpen}
    <div class="fixed inset-0 z-50 flex items-start justify-end">
      <!-- 遮罩层 -->
      <div class="fixed inset-0 bg-black/20" onclick={() => (isSettingsOpen = false)} onkeydown={(e) => e.key === 'Escape' && (isSettingsOpen = false)} role="button" tabindex="0" aria-label="关闭设置"></div>

      <!-- 设置对话框 -->
      <div class="bg-base-100 rounded-box border-base-300 relative mt-16 mr-4 max-h-96 w-96 overflow-y-auto border shadow-lg">
        <div class="p-4">
          <h3 class="mb-3 font-semibold">{m.sys_container_settings()}</h3>

          <!-- 使用说明 -->
          <div class="form-control">
            <div class="label">
              <span class="label-text">使用说明</span>
            </div>
            <div class="text-base-content/80 text-sm">
              <p class="mb-2">此系统使用 MCP (Model Context Protocol) 进行智能 UI 生成。</p>
              <p class="mb-2">支持以下功能：</p>
              <ul class="list-inside list-disc space-y-1 text-xs">
                <li>表格、图表、表单生成</li>
                <li>卡片、图片、视频展示</li>
                <li>日历、时间轴组件</li>
                <li>Markdown 文档渲染</li>
              </ul>
            </div>
          </div>

          <!-- 语音控制状态 -->
          <div class="form-control mt-4">
            <div class="label">
              <span class="label-text">语音控制</span>
            </div>
            <div class="text-base-content/60 text-sm">
              {voiceSupported ? '✅ 支持语音输入' : '❌ 浏览器不支持语音输入'}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- 错误提示 -->
  {#if currentError}
    <div class="alert alert-error mx-4 mt-4 flex items-center justify-between">
      <span>{currentError}</span>
      <button class="btn btn-ghost btn-sm" onclick={() => (currentError = null)} aria-label={m.sys_container_close_error()}>
        <span class="icon-[lucide--x] size-4"></span>
      </button>
    </div>
  {/if}

  <!-- 主要内容区域 -->
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- UI容器 -->
    <div class="flex-1 overflow-auto p-4">
      {#if currentConversation?.response || currentConversation?.nluiProp}
        <div class="space-y-4">
          <!-- 文字响应 -->
          {#if currentConversation?.response}
            <div class="bg-base-200 rounded-lg p-4">
              <div class="text-base-content prose max-w-none">
                {currentConversation.response}
              </div>
            </div>
          {/if}

          <!-- UI 组件 -->
          {#if currentConversation?.nluiProp}
            <div class="bg-base-100 border-base-300 rounded-lg border shadow-sm">
              <UIContainer nluiProp={currentConversation.nluiProp} />
            </div>
          {/if}
        </div>
      {:else}
        <div class="flex h-full items-center justify-center">
          <div class="text-center">
            <div class="icon-[lucide--message-circle] text-base-content/30 mx-auto mb-4 size-16"></div>
            <p class="text-base-content/60">{m.sys_container_empty_state_title()}</p>
            <p class="text-base-content/40 mt-2 text-sm">{m.sys_container_empty_state_subtitle()}</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- 输入区域 -->
    <div class="border-base-300 bg-base-200 border-t p-4">
      <div class="mx-auto max-w-4xl">
        <div class="flex items-end gap-2">
          <!-- 消息输入框 -->
          <div class="flex-1">
            <textarea
              bind:value={userInput}
              placeholder={m.sys_container_input_placeholder()}
              class="textarea textarea-bordered max-h-48 min-h-[2.5rem] w-full resize-none"
              rows="3"
              disabled={isLoading}
              onkeydown={handleTextareaKeyDown}></textarea>
          </div>

          <!-- 按钮组 - 垂直对齐底部 -->
          <div class="flex items-end gap-2">
            <!-- 语音输入按钮 -->
            {#if voiceSupported}
              <button
                class="btn"
                class:btn-error={isVoiceRecording}
                class:btn-ghost={!isVoiceRecording}
                onclick={toggleVoiceRecording}
                disabled={isLoading}
                title={isVoiceRecording ? m.sys_container_voice_stop() : m.sys_container_voice_start()}
                aria-label={isVoiceRecording ? m.sys_container_voice_stop() : m.sys_container_voice_start()}>
                {#if isVoiceRecording}
                  <span class="icon-[lucide--mic-off] text-error size-4"></span>
                {:else}
                  <span class="icon-[lucide--mic] size-4"></span>
                {/if}
              </button>
            {/if}

            <!-- 发送按钮 -->
            <button class="btn btn-primary" onclick={handleSendMessage} disabled={!userInput.trim() || isLoading} title={m.sys_container_send()} aria-label={m.sys_container_send()}>
              {#if isLoading}
                <span class="loading loading-spinner loading-sm"></span>
              {:else}
                <span class="icon-[lucide--send] size-4"></span>
              {/if}
              <span class="hidden sm:inline">{m.sys_container_send()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
