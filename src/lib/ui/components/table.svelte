<script lang="ts">
	import { title } from 'process';
	import * as m from '../../../paraglide/messages.js';
	import { getBaseClasses, handleAction } from '../common/base.utils.js';
	import type { NLUITableComponentProps } from './table.types.js';

	let tableProps: NLUITableComponentProps = $props();

	// 获取单元格数据 / Get cell data
	function getCellData(row: any, columnKey: string): string {
		const value = row.data[columnKey];
		if (value === null || value === undefined) return '';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}

	function getIconClass(type: string): string {
		switch (type) {
			case 'create':
				return 'icon-[octicon--file-added-12]';
			case 'edit':
				return 'icon-[octicon--pencil-12]';
			case 'delete':
				return 'icon-[octicon--trash-12]';
			case 'view':
				return 'icon-[octicon--eye-12]';
			case 'download':
				return 'icon-[octicon--download-12]';
			default:
				return 'icon-[octicon--eye-12]';
		}
	}
</script>

<div class="overflow-x-auto">
	<table class={getBaseClasses('table', tableProps.size)}>
		{#if tableProps.title}
			<caption class="text-base-content p-5 text-left">
				{tableProps.title}
			</caption>
		{/if}
		<thead>
			<tr>
				{#each tableProps.columns as column}
					<th data-key={column.key}>{column.title}</th>
				{/each}
				{#if tableProps.rows.some((row) => row.actions && row.actions.length > 0)}
					<th class="text-center">{m.table_actions()}</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#if tableProps.rows.length === 0}
				<tr>
					<td
						colspan={tableProps.columns.length +
							(tableProps.rows.some((row) => row.actions) ? 1 : 0)}
						class="text-base-content/60 py-8 text-center"
					>
						{tableProps.noDataPrompt || m.table_no_data()}
					</td>
				</tr>
			{:else}
				{#each tableProps.rows as row}
					<tr>
						{#each tableProps.columns as column}
							<td>
								{getCellData(row, column.key)}
							</td>
						{/each}
						{#if row.actions && row.actions.length > 0}
							<td>
								{#each row.actions as action}
									{#if action.type}
										<button
											class="btn btn-circle btn-text btn-sm"
											aria-label={action.label || ''}
											onclick={() => handleAction('table', action)}
											><span class="{getIconClass(action.type)} size-5"></span></button
										>
									{:else}
										<button
											class="btn btn-circle btn-text btn-sm"
											aria-label={action.label || ''}
											onclick={() => handleAction('table', action)}>{action.label || '...'}</button
										>
									{/if}
								{/each}
							</td>
						{:else if tableProps.rows.some((r) => r.actions && r.actions.length > 0)}
							<!-- 空操作列，保持对齐 / Empty actions column for alignment -->
							<td class="text-center">-</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
