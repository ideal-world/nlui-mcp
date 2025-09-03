<script lang="ts">
  import type { NLUIBlock, NLUIComponent } from '../ui/nluiProps.types';
  import ComponentRenderer from './ComponentRenderer.svelte';
  import BlockRenderer from './BlockRenderer.svelte';

  interface Props {
    block: NLUIBlock;
    isRoot?: boolean;
  }

  let { block, isRoot = false }: Props = $props();

  /**
   * 检查是否为组件类型
   * Check if item is a component type
   */
  function isComponent(item: NLUIComponent | NLUIBlock): item is NLUIComponent {
    return 'kind' in item;
  }
</script>

<div class={`${isRoot ? 'h-full' : ''} flex flex-col`}>
  <!-- Header -->
  {#if block.header}
    <div class="bg-base-100 border-base-300 flex-shrink-0 border-b p-4">
      {#if isComponent(block.header)}
        <ComponentRenderer component={block.header} />
      {:else}
        <BlockRenderer block={block.header} />
      {/if}
    </div>
  {/if}

  <!-- Main Content Area with Sidebars -->
  <div class={`${isRoot ? 'flex-1' : ''} flex overflow-hidden`}>
    <!-- Left Sidebar -->
    {#if block.left}
      <div class="bg-base-100 border-base-300 w-64 flex-shrink-0 overflow-auto border-r p-4">
        {#if isComponent(block.left)}
          <ComponentRenderer component={block.left} />
        {:else}
          <BlockRenderer block={block.left} />
        {/if}
      </div>
    {/if}

    <!-- Main Content -->
    <div class="flex-1 overflow-auto p-4">
      {#if isComponent(block.main)}
        <ComponentRenderer component={block.main} />
      {:else}
        <BlockRenderer block={block.main} />
      {/if}
    </div>

    <!-- Right Sidebar -->
    {#if block.right}
      <div class="bg-base-100 border-base-300 w-64 flex-shrink-0 overflow-auto border-l p-4">
        {#if isComponent(block.right)}
          <ComponentRenderer component={block.right} />
        {:else}
          <BlockRenderer block={block.right} />
        {/if}
      </div>
    {/if}
  </div>

  <!-- Footer -->
  {#if block.footer}
    <div class="bg-base-100 border-base-300 flex-shrink-0 border-t p-4">
      {#if isComponent(block.footer)}
        <ComponentRenderer component={block.footer} />
      {:else}
        <BlockRenderer block={block.footer} />
      {/if}
    </div>
  {/if}
</div>
