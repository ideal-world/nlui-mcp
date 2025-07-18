<script lang="ts">
	import * as m from '../../paraglide/messages';
	import type { NLUIBlock, NLUIComponent, NLUIProps } from '../ui/nluiProps.types';
	import ComponentRenderer from './ComponentRenderer.svelte';
	import RenderError from './RenderError.svelte';

	interface Props {
		nluiProp: NLUIProps;
	}

	let { nluiProp }: Props = $props();

	// 错误状态管理 / Error state management
	let renderError = $state('');
	let errorDetails = $state('');

	/**
	 * 检查是否为组件类型
	 * Check if item is a component type
	 */
	function isComponent(item: NLUIComponent | NLUIBlock): item is NLUIComponent {
		return 'kind' in item;
	}
</script>

<svelte:head>
	<title
		>{nluiProp.block.main &&
		isComponent(nluiProp.block.main) &&
		nluiProp.block.main.cardProps?.title
			? nluiProp.block.main.cardProps.title
			: m.app_title()}</title
	>
	<meta name="description" content={m.app_description()} />
</svelte:head>

<div class="bg-base-200 min-h-screen">
	{#if renderError}
		<!-- 渲染错误状态 / Render Error State -->
		<RenderError errorMessage={renderError} {errorDetails} />
	{:else}
		<!-- 主布局 / Main Layout -->
		<div class="grid h-screen {nluiProp.showTools ? 'grid-rows-[1fr_auto]' : 'grid-rows-[1fr]'}">
			<div
				class="grid {nluiProp.block.left && nluiProp.block.right
					? 'grid-cols-[250px_1fr_250px]'
					: nluiProp.block.left
						? 'grid-cols-[250px_1fr]'
						: nluiProp.block.right
							? 'grid-cols-[1fr_250px]'
							: 'grid-cols-[1fr]'} {nluiProp.block.header && nluiProp.block.footer
					? 'grid-rows-[auto_1fr_auto]'
					: nluiProp.block.header
						? 'grid-rows-[auto_1fr]'
						: nluiProp.block.footer
							? 'grid-rows-[1fr_auto]'
							: 'grid-rows-[1fr]'}"
			>
				<!-- Header -->
				{#if nluiProp.block.header}
					<div class="bg-base-100/50 border-base-300/50 col-span-full border-b p-4">
						{#if isComponent(nluiProp.block.header)}
							<ComponentRenderer component={nluiProp.block.header} />
						{:else}
							<!-- Nested block rendering would go here -->
							<div class="text-base-content/50 text-center">
								嵌套布局块暂未实现 / Nested blocks not yet implemented
							</div>
						{/if}
					</div>
				{/if}

				<!-- Left Sidebar -->
				{#if nluiProp.block.left}
					<div class="bg-base-100/30 border-base-300/50 border-r p-4">
						{#if isComponent(nluiProp.block.left)}
							<ComponentRenderer component={nluiProp.block.left} />
						{:else}
							<div class="text-base-content/50 text-center">
								嵌套布局块暂未实现 / Nested blocks not yet implemented
							</div>
						{/if}
					</div>
				{/if}

				<!-- Main Content -->
				<div class="relative z-10 flex items-center justify-center p-4">
					{#if isComponent(nluiProp.block.main)}
						<div class="w-full max-w-2xl">
							<ComponentRenderer component={nluiProp.block.main} />
						</div>
					{:else}
						<div class="text-base-content/50 text-center">
							嵌套布局块暂未实现 / Nested blocks not yet implemented
						</div>
					{/if}
				</div>

				<!-- Right Sidebar -->
				{#if nluiProp.block.right}
					<div class="bg-base-100/30 border-base-300/50 border-l p-4">
						{#if isComponent(nluiProp.block.right)}
							<ComponentRenderer component={nluiProp.block.right} />
						{:else}
							<div class="text-base-content/50 text-center">
								嵌套布局块暂未实现 / Nested blocks not yet implemented
							</div>
						{/if}
					</div>
				{/if}

				<!-- Footer -->
				{#if nluiProp.block.footer}
					<div class="bg-base-100/50 border-base-300/50 col-span-full border-t p-4">
						{#if isComponent(nluiProp.block.footer)}
							<ComponentRenderer component={nluiProp.block.footer} />
						{:else}
							<div class="text-base-content/50 text-center">
								嵌套布局块暂未实现 / Nested blocks not yet implemented
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- 工具栏 / Toolbar -->
			{#if nluiProp.showTools}
				<div class="bg-base-100/80 border-base-300 relative z-50 border-t backdrop-blur-xs">
					<div class="mx-auto flex max-w-7xl items-center justify-between">
						<div class="flex items-center gap-1">
							<h1 class="text-base-content text-[10px] font-semibold">NLUI</h1>
						</div>
						<div class="flex items-center gap-0.5">
							{#if nluiProp.showDebug}
								<div class="relative">
									<button
										class="btn btn-text btn-xs h-5 min-h-5 px-1"
										onclick={(e) => {
											const details = e.currentTarget.nextElementSibling;
											if (details instanceof HTMLDetailsElement) {
												details.open = !details.open;
											}
										}}
									>
										<span class="icon-[lucide--bug] size-2.5"></span>
										<span class="hidden text-[10px] sm:inline">Debug</span>
									</button>
									<details class="absolute right-0 bottom-full z-[100] mb-1">
										<summary class="hidden"></summary>
										<div class="card card-sm w-96 p-3">
											<div class="card-header mb-2 flex items-center gap-2">
												<span class="icon-[lucide--bug] text-primary size-4"></span>
												<span class="text-base-content text-sm font-medium">Debug Information</span>
											</div>
											<div class="card-body">
												<pre
													class="text-base-content bg-base-200 max-h-64 overflow-auto rounded p-2 text-xs">{JSON.stringify(
														nluiProp,
														null,
														2
													)}</pre>
											</div>
										</div>
									</details>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
