<script lang="ts">
	import { browser } from '$app/environment';

	let isDropdownOpen = $state(false);
	let currentTheme = $state('light');

	// 支持的主题列表 / Supported theme list
	const themes = [
		{ id: 'light', name: 'Light', icon: '☀️' },
		{ id: 'dark', name: 'Dark', icon: '🌙' },
		{ id: 'black', name: 'Black', icon: '⚫' },
		{ id: 'corporate', name: 'Corporate', icon: '🏢' },
		{ id: 'ghibli', name: 'Ghibli', icon: '🌿' },
		{ id: 'gourmet', name: 'Gourmet', icon: '🍽️' },
		{ id: 'luxury', name: 'Luxury', icon: '💎' },
		{ id: 'mintlify', name: 'Mintlify', icon: '🌿' },
		{ id: 'shadcn', name: 'Shadcn', icon: '🎨' },
		{ id: 'slack', name: 'Slack', icon: '💬' },
		{ id: 'soft', name: 'Soft', icon: '🌸' },
		{ id: 'valorant', name: 'Valorant', icon: '⚔️' }
	];

	/**
	 * 应用主题到文档
	 * Apply theme to document
	 */
	function applyTheme(theme: string) {
		if (!browser) return;

		currentTheme = theme;
		localStorage.setItem('theme', theme);

		// 通过设置 data-theme 属性应用 FlyonUI 主题
		document.documentElement.setAttribute('data-theme', theme);
	}

	/**
	 * 处理主题切换
	 * Handle theme change
	 */
	function handleThemeChange(theme: string) {
		applyTheme(theme);
		isDropdownOpen = false;
	}

	// 初始化主题 / Initialize theme
	$effect(() => {
		if (browser) {
			const savedTheme = localStorage.getItem('theme') || 'light';
			currentTheme = savedTheme;
			applyTheme(savedTheme);
		}
	});
</script>

<div class="relative">
	<button
		class="btn btn-text btn-xs"
		onclick={() => (isDropdownOpen = !isDropdownOpen)}
		aria-label="Switch theme"
		title="Switch theme"
	>
		<span class="text-sm">
			{themes.find((t) => t.id === currentTheme)?.icon || '🔄'}
		</span>
		<span class="hidden sm:inline">Theme</span>
		<span class="icon-[lucide--chevron-down] size-3"></span>
	</button>

	{#if isDropdownOpen}
		<div
			class="card card-sm absolute top-full right-0 z-[100] mt-1 max-h-64 w-48 overflow-y-auto py-1"
		>
			{#each themes as theme}
				<button
					class="text-base-content hover:bg-base-200 flex w-full items-center gap-2 px-3 py-1.5 text-xs {currentTheme ===
					theme.id
						? 'bg-primary/10 text-primary'
						: ''}"
					onclick={() => handleThemeChange(theme.id)}
				>
					<span class="text-sm">{theme.icon}</span>
					<span>{theme.name}</span>
					{#if currentTheme === theme.id}
						<span class="icon-[lucide--check] ml-auto size-3"></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- 点击外部区域关闭下拉菜单 / Click outside to close dropdown -->
{#if isDropdownOpen}
	<div
		class="fixed inset-0 z-[99]"
		onclick={() => (isDropdownOpen = false)}
		aria-hidden="true"
	></div>
{/if}
