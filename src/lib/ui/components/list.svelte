<script lang="ts">
	import type { NLUIListComponentProps, NLUIListItem } from './list.types';
	import { logger } from '../../utils/logger';
	import { ErrorHandler } from '../../utils/errorHandler';
	import * as m from '../../../paraglide/messages';

	let listProps: NLUIListComponentProps = $props();

	// 搜索状态
	let searchQuery = $state('');

	/**
	 * 过滤后的列表项
	 * Filtered list items
	 */
	let filteredItems = $derived(
		searchQuery
			? listProps.items.filter(
					(item) =>
						item.primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(item.secondary && item.secondary.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			: listProps.items
	);

	/**
	 * 处理操作点击
	 * Handle action click
	 */
	function handleAction(
		action: { label: string; link?: string; type?: string },
		item: NLUIListItem,
		event: Event
	): void {
		try {
			event.stopPropagation();

			logger.info('List action clicked', {
				component: 'ListComponent',
				action: 'actionClick',
				metadata: { 
					actionLabel: action.label,
					itemPrimary: item.primary,
					hasLink: !!action.link,
					actionType: action.type
				}
			});

			if (action.link) {
				window.open(action.link, '_blank', 'noopener,noreferrer');
			} else {
				alert(`${m.list_action_executed()}: ${action.label}\n${m.list_item()}: ${item.primary}`);
			}
		} catch (error) {
			ErrorHandler.handle(error, {
				component: 'ListComponent',
				action: 'actionClick',
				metadata: { actionLabel: action.label, itemPrimary: item.primary }
			});
		}
	}

	/**
	 * 处理列表项点击
	 * Handle list item click
	 */
	function handleItemClick(item: NLUIListItem): void {
		try {
			logger.info('List item clicked', {
				component: 'ListComponent',
				action: 'itemClick',
				metadata: { 
					itemPrimary: item.primary,
					hasLink: !!item.link
				}
			});

			if (item.link) {
				window.open(item.link, '_blank', 'noopener,noreferrer');
			}
		} catch (error) {
			ErrorHandler.handle(error, {
				component: 'ListComponent',
				action: 'itemClick',
				metadata: { itemPrimary: item.primary }
			});
		}
	}

	/**
	 * 处理搜索输入
	 * Handle search input
	 */
	function handleSearchInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		logger.debug('List search performed', {
			component: 'ListComponent',
			action: 'search',
			metadata: { 
				query: searchQuery,
				resultsCount: filteredItems.length,
				totalItems: listProps.items.length
			}
		});
	}

	/**
	 * 清除搜索
	 * Clear search
	 */
	function clearSearch(): void {
		searchQuery = '';
		logger.debug('List search cleared', {
			component: 'ListComponent',
			action: 'clearSearch'
		});
	}

	/**
	 * 获取按钮样式类
	 * Get button style classes
	 */
	function getButtonClass(type: string = 'primary'): string {
		const baseClass = 'btn btn-xs';
		const typeMap: Record<string, string> = {
			primary: 'btn-primary',
			secondary: 'btn-secondary',
			outline: 'btn-outline',
			ghost: 'btn-ghost',
			link: 'btn-link'
		};
		return `${baseClass} ${typeMap[type] || typeMap.primary}`;
	}

	/**
	 * 检查内容是否为空
	 * Check if content is empty
	 */
	function isContentEmpty(content: string | undefined | null): boolean {
		return !content || content.trim().length === 0;
	}

	/**
	 * 是否为图片URL
	 * Check if is image URL
	 */
	function isImageUrl(url: string | undefined): boolean {
		if (!url) return false;
		return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
	}

	// 记录列表渲染
	logger.debug('List component rendered', {
		component: 'ListComponent',
		action: 'render',
		metadata: {
			itemsCount: listProps.items.length,
			hasTitle: !!listProps.title,
			isSearchable: listProps.searchable
		}
	});
</script>

<!-- 列表容器 / List Container -->
<div class="w-full">
	<!-- 列表标题 / List Title -->
	{#if listProps.title}
		<div class="mb-4">
			<h3 class="text-lg font-semibold">{listProps.title}</h3>
		</div>
	{/if}

	<!-- 搜索框 / Search Box -->
	{#if listProps.searchable}
		<div class="mb-4">
			<div class="form-control">
				<div class="input-group">
					<input
						type="text"
						placeholder={m.list_search_placeholder()}
						class="input input-bordered flex-1"
						value={searchQuery}
						oninput={handleSearchInput}
					/>
					{#if searchQuery}
						<button
							type="button"
							class="btn btn-square btn-outline"
							onclick={clearSearch}
							aria-label={m.list_clear_search()}
							title={m.list_clear_search()}
						>
							✕
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- 列表项 / List Items -->
	<div class="space-y-2">
		{#each filteredItems as item, index}
			<div
				class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
				onclick={() => handleItemClick(item)}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && handleItemClick(item)}
			>
				<div class="card-body p-4">
					<div class="flex items-center gap-3">
						<!-- 内容区域 / Content Area -->
						<div class="flex-1 min-w-0">
							<!-- 主要文本 / Primary Text -->
							<div class="font-medium text-base-content">
								{item.primary}
							</div>

							<!-- 次要文本 / Secondary Text -->
							{#if !isContentEmpty(item.secondary)}
								<div class="text-sm text-base-content/70 mt-1">
									{item.secondary}
								</div>
							{/if}
						</div>

						<!-- 操作按钮 / Action Buttons -->
						{#if item.actions && item.actions.length > 0}
							<div class="flex gap-2">
								{#each item.actions as action}
									<button
										type="button"
										class={getButtonClass(action.type)}
										onclick={(e) => handleAction(action, item, e)}
										title={action.label}
									>
										{action.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- 空数据提示 / Empty Data Message -->
	{#if filteredItems.length === 0}
		<div class="text-center py-12 text-base-content/60">
			{#if searchQuery}
				<!-- 搜索无结果 / No Search Results -->
				<div class="text-6xl mb-4">🔍</div>
				<p class="text-lg font-medium">{m.list_no_search_results()}</p>
				<p class="text-sm">{m.list_no_search_results_description()}</p>
				<button 
					type="button"
					class="btn btn-outline btn-sm mt-4"
					onclick={clearSearch}
				>
					{m.list_clear_search()}
				</button>
			{:else}
				<!-- 列表为空 / Empty List -->
				<div class="text-6xl mb-4">📝</div>
				<p class="text-lg font-medium">{m.list_no_data()}</p>
				<p class="text-sm">{m.list_no_data_description()}</p>
			{/if}
		</div>
	{/if}

	<!-- 列表信息栏 / List Info Bar -->
	{#if filteredItems.length > 0}
		<div class="mt-4 text-sm text-base-content/60 text-center">
			{#if searchQuery}
				{m.list_search_results({ found: filteredItems.length, total: listProps.items.length })}
			{:else}
				{m.list_total_items({ count: listProps.items.length })}
			{/if}
		</div>
	{/if}
</div>
