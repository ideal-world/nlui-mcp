<script lang="ts">
	import * as m from '../../../paraglide/messages.js';
	import { ErrorHandler } from '../../utils/errorHandler';
	import type { NLUITableComponentProps } from './table.types.js';

	let tableProps: NLUITableComponentProps = $props();

	// 解构表格属性
	const { columns, rows, caption, footer, striped = false, size = 'md' } = tableProps;

	/**
	 * 尺寸样式类映射
	 * Size class mapping
	 */
	const sizeClasses: Record<string, string> = {
		xs: 'table-xs',
		sm: 'table-sm',
		md: '',
		lg: 'table-lg',
		xl: 'table-xl'
	};

	/**
	 * 构建表格样式类
	 * Build table style classes
	 */
	const tableClasses = ['table', sizeClasses[size], striped && 'table-striped']
		.filter(Boolean)
		.join(' ');

	/**
	 * 处理操作按钮点击
	 * Handle action button click
	 */
	function handleAction(
		action: { label: string; onClickLink?: string },
		rowId: string | number
	): void {
		// TODO
		try {
			if (action.onClickLink) {
				window.open(action.onClickLink, '_blank', 'noopener,noreferrer');
			}
		} catch (error) {
			ErrorHandler.handle(error, {
				component: 'TableComponent',
				action: 'buttonClick',
				metadata: { actionLabel: action.label, rowId }
			});
		}
	}

	/**
	 * 获取按钮样式类
	 * Get button style classes
	 */
	function getButtonClass(variant: string = 'primary'): string {
		const baseClass = 'btn btn-sm';
		const variantMap: Record<string, string> = {
			secondary: 'btn-secondary',
			outline: 'btn-outline',
			ghost: 'btn-ghost',
			primary: 'btn-primary'
		};
		return `${baseClass} ${variantMap[variant] || variantMap.primary}`;
	}

	/**
	 * 获取单元格对齐样式
	 * Get cell alignment style
	 */
	function getCellAlignment(align?: 'left' | 'center' | 'right'): string {
		const alignmentMap: Record<string, string> = {
			center: 'text-center',
			right: 'text-right',
			left: 'text-left'
		};
		return alignmentMap[align || 'left'];
	}

	// 获取单元格数据 / Get cell data
	function getCellData(row: any, columnKey: string): string {
		const value = row.data[columnKey];
		if (value === null || value === undefined) return '';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}
</script>

<!-- 表格容器 / Table Container -->
<div class="overflow-x-auto">
	<table class={tableClasses}>
		<!-- 表格标题 / Table Caption -->
		{#if caption}
			<caption class="mb-4 caption-top text-center text-lg font-semibold">
				{caption}
			</caption>
		{/if}

		<!-- 表格头部 / Table Header -->
		{#if columns.length > 0}
			<thead>
				<tr>
					{#each columns as column}
						<th
							class={getCellAlignment(column.align)}
							style={column.width ? `width: ${column.width}` : ''}
						>
							<div class="flex items-center gap-2">
								{column.title}
								{#if column.sortable}
									<button class="btn btn-ghost btn-xs" aria-label={m.table_sort()}>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
											></path>
										</svg>
									</button>
								{/if}
							</div>
						</th>
					{/each}
					<!-- 操作列头 / Actions Column Header -->
					{#if rows.some((row) => row.actions && row.actions.length > 0)}
						<th class="text-center">{m.table_actions()}</th>
					{/if}
				</tr>
			</thead>
		{/if}

		<!-- 表格主体 / Table Body -->
		<tbody>
			{#if rows.length === 0}
				<!-- 空数据状态 / Empty Data State -->
				<tr>
					<td
						colspan={columns.length + (rows.some((row) => row.actions) ? 1 : 0)}
						class="text-base-content/60 py-8 text-center"
					>
						{m.table_no_data()}
					</td>
				</tr>
			{:else}
				{#each rows as row}
					<tr>
						<!-- 数据列 / Data Columns -->
						{#each columns as column}
							<td class={getCellAlignment(column.align)}>
								{getCellData(row, column.key)}
							</td>
						{/each}

						<!-- 操作列 / Actions Column -->
						{#if row.actions && row.actions.length > 0}
							<td class="text-center">
								<div class="flex flex-wrap justify-center gap-2">
									{#each row.actions as action}
										<button
											class={getButtonClass(action.variant)}
											onclick={() => handleAction(action, row.id)}
										>
											{action.label}
										</button>
									{/each}
								</div>
							</td>
						{:else if rows.some((r) => r.actions && r.actions.length > 0)}
							<!-- 空操作列，保持对齐 / Empty actions column for alignment -->
							<td class="text-center">-</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>

		<!-- 表格底部 / Table Footer -->
		{#if footer}
			<tfoot>
				<tr>
					<td
						colspan={columns.length + (rows.some((row) => row.actions) ? 1 : 0)}
						class="text-center font-semibold"
					>
						{footer}
					</td>
				</tr>
			</tfoot>
		{/if}
	</table>

	<!-- 空数据提示 / Empty Data Message -->
	{#if rows.length === 0}
		<div class="text-base-content/60 py-8 text-center">
			<div class="mb-4 text-6xl">📊</div>
			<p class="text-lg font-medium">{m.table_no_data()}</p>
			<p class="text-sm">{m.table_no_data_description()}</p>
		</div>
	{/if}
</div>
