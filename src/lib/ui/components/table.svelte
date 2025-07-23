<script lang="ts">
  import * as m from '../../../paraglide/messages.js';
  import { getBaseClasses, getIconClass, getSmallerSizeClassSuffix, handleAction } from '../common/base.utils.js';
  import type { NLUITableComponentProps } from './table.types.js';

  let tableProps: NLUITableComponentProps = $props();

  let searchQuery: string = $state('');
  let currentPage: number = $state(1);

  let filteredRows = $derived(searchQuery.trim() ? tableProps.rows.filter((row) => tableProps.columns.some((column) => getCellData(row, column.key).toLowerCase().includes(searchQuery.toLowerCase()))) : tableProps.rows);

  let totalPages = $derived(tableProps.pageSize ? Math.ceil(filteredRows.length / tableProps.pageSize) : 1);

  let pageRows = $derived(tableProps.pageSize ? filteredRows.slice((currentPage - 1) * tableProps.pageSize, currentPage * tableProps.pageSize) : filteredRows);

  function getCellData(row: any, columnKey: string): string {
    const value = row.data[columnKey];
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  // Reset to first page when search changes
  $effect(() => {
    if (searchQuery) {
      currentPage = 1;
    }
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<div class="w-full">
  {#if tableProps.title}
    <div class="text-base-content p-5 text-left font-bold">
      {tableProps.title}
    </div>
  {/if}
  {#if tableProps.searchable}
    <div class="mb-4 flex flex-wrap justify-end">
      <div class="input input-{getSmallerSizeClassSuffix(tableProps.size)} max-w-xs">
        <span class="icon-[tabler--search] text-base-content/80 my-auto me-3 shrink-0"></span>
        <input type="search" class="grow" bind:value={searchQuery} placeholder={m.table_search_placeholder()} />
      </div>
    </div>
  {/if}
  <div class="overflow-x-auto">
    <table class={getBaseClasses('table', tableProps.size)}>
      <thead>
        <tr>
          {#each tableProps.columns as column}
            <th data-key={column.key}>{column.title}</th>
          {/each}
          {#if tableProps.actions}
            <th class="text-center">{m.table_actions()}</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#if pageRows.length === 0}
          <tr>
            <td colspan={tableProps.columns.length + (tableProps.actions ? 1 : 0)} class="text-base-content/60 py-8 text-center">
              {tableProps.noDataPrompt || m.table_no_data()}
            </td>
          </tr>
        {:else}
          {#each pageRows as row}
            <tr>
              {#each tableProps.columns as column}
                <td>
                  {#if column.tagStyle}
                    <span class="badge badge-soft badge-success text-{getSmallerSizeClassSuffix(tableProps.size)}">
                      {getCellData(row, column.key)}
                    </span>
                  {:else}
                    {getCellData(row, column.key)}
                  {/if}
                </td>
              {/each}
              {#if tableProps.actions}
                <td>
                  {#each tableProps.actions as action}
                    {#if action.type}
                      <button class="btn btn-circle btn-text btn-{getSmallerSizeClassSuffix(tableProps.size)}" aria-label={action.label || ''} onclick={() => handleAction('table', action, { id: row.id })}>
                        <span class="{getIconClass(action.type)} size-5"></span>
                      </button>
                    {:else}
                      <button class="btn btn-circle btn-text btn-{getSmallerSizeClassSuffix(tableProps.size)}" aria-label={action.label || ''} onclick={() => handleAction('table', action, { id: row.id })}
                        >{action.label || '...'}</button>
                    {/if}
                  {/each}
                </td>
              {/if}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  {#if tableProps.pageSize && filteredRows.length > 0}
    {@const start = filteredRows.length > 0 ? (currentPage - 1) * tableProps.pageSize + 1 : 0}
    {@const end = Math.min(currentPage * tableProps.pageSize, filteredRows.length)}
    {@const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      const startPage = Math.max(1, currentPage - 2);
      return Math.min(totalPages, startPage + i);
    })}

    <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="text-base-content/80 text-sm">
        {m.table_showing()}
        <span class="text-base-content font-semibold">{start}-{end}</span>
        {m.table_of()}
        <span class="font-semibold">{filteredRows.length}</span>
        {filteredRows.length === 1 ? m.table_item() : m.table_items()}
      </div>

      {#if totalPages > 1}
        <nav class="join">
          <button type="button" class="btn btn-soft btn-square join-item" aria-label={m.table_previous_page()} disabled={currentPage === 1} onclick={() => goToPage(currentPage - 1)}>
            <span class="icon-[tabler--chevron-left] size-5"></span>
          </button>

          {#each pageNumbers as pageNum}
            <button type="button" class="btn btn-soft join-item btn-square {currentPage === pageNum ? 'btn-primary' : ''}" onclick={() => goToPage(pageNum)} aria-label={m.table_page({ page: pageNum })}>
              {pageNum}
            </button>
          {/each}

          <button type="button" class="btn btn-soft btn-square join-item" aria-label={m.table_next_page()} disabled={currentPage === totalPages} onclick={() => goToPage(currentPage + 1)}>
            <span class="icon-[tabler--chevron-right] size-5"></span>
          </button>
        </nav>
      {/if}
    </div>
  {/if}
</div>
