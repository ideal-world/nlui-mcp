<script lang="ts">
  import { browser } from '$app/environment';
  import { locales } from '../../paraglide/runtime';
  import * as m from '../../paraglide/messages';
  import { setLocale, getLocale } from '../../paraglide/runtime';

  let isDropdownOpen = $state(false);

  // 语言名称映射 / Language name mapping
  const languageNames = {
    en: 'English',
    zh: '中文'
  };

  // 语言旗帜映射 / Language flag mapping
  const languageFlags = {
    en: '🇺🇸',
    zh: '🇨🇳'
  };

  /**
   * 获取当前语言设置
   * Get current locale setting
   */
  function getCurrentLocale() {
    return getLocale();
  }

  /**
   * 检测浏览器语言并自动设置
   * Detect browser language and set automatically
   */
  function detectBrowserLanguage() {
    if (!browser) return;

    const browserLang = navigator.language || navigator.languages?.[0];
    const langCode = browserLang.split('-')[0];

    // 检查是否是支持的语言
    if ((langCode === 'en' || langCode === 'zh') && langCode !== getCurrentLocale()) {
      setLocale(langCode);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  /**
   * 处理语言切换
   * Handle language change
   */
  function handleLanguageChange(newLocale: string) {
    const currentLocale = getCurrentLocale();

    if (browser && newLocale !== currentLocale && (newLocale === 'en' || newLocale === 'zh')) {
      try {
        isDropdownOpen = false;
        setLocale(newLocale);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error('Language switch failed:', error);
      }
    }
  }

  /**
   * 切换下拉菜单状态
   * Toggle dropdown state
   */
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  /**
   * 关闭下拉菜单
   * Close dropdown
   */
  function closeDropdown() {
    isDropdownOpen = false;
  }

  /**
   * 处理点击外部区域
   * Handle click outside
   */
  function handleClickOutside(event: Event) {
    if (!event?.target) return;
    const target = event.target as Element;
    if (!target.closest('.language-dropdown')) {
      closeDropdown();
    }
  }

  // 初始化语言设置 / Initialize language settings
  $effect(() => {
    if (browser) {
      const hasLanguageCookie = document.cookie.includes('PARAGLIDE_LOCALE=');

      if (!hasLanguageCookie || getCurrentLocale() === 'en') {
        detectBrowserLanguage();
      }
    }
  });

  // 点击外部区域关闭下拉菜单 / Close dropdown when clicking outside
  $effect(() => {
    if (browser && isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });
</script>

<div class="language-dropdown relative">
  <button class="btn btn-text btn-xs" onclick={toggleDropdown} aria-label={m.language_switcher()} title={m.language_switcher()}>
    <span class="text-sm">{languageFlags[getCurrentLocale()]}</span>
    <span class="hidden sm:inline">{languageNames[getCurrentLocale()]}</span>
    <span class="icon-[lucide--chevron-down] size-3 {isDropdownOpen ? 'rotate-180' : ''}"></span>
  </button>

  {#if isDropdownOpen}
    <div class="card card-sm absolute top-full right-0 z-[100] mt-1 max-h-64 w-32 overflow-y-auto py-1">
      {#each locales as locale}
        <button
          class="text-base-content hover:bg-base-200 flex w-full items-center gap-2 px-3 py-1.5 text-xs {getCurrentLocale() === locale ? 'bg-primary/10 text-primary' : ''}"
          onclick={() => handleLanguageChange(locale)}
        >
          <span class="text-sm">{languageFlags[locale]}</span>
          <span>{languageNames[locale]}</span>
          {#if getCurrentLocale() === locale}
            <span class="icon-[lucide--check] ml-auto size-3"></span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- 点击外部区域关闭下拉菜单 / Click outside to close dropdown -->
{#if isDropdownOpen}
  <div class="fixed inset-0 z-[99]" onclick={closeDropdown} aria-hidden="true"></div>
{/if}
