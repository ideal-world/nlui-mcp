<script lang="ts">
  import { getBaseClasses } from '../common/base.utils.js';
  import type { NLUIMarkdownComponentProps } from './markdown.types.js';
  import { marked } from 'marked';

  let markdownProps: NLUIMarkdownComponentProps = $props();

  let renderedContent = $derived(markdownProps.content ? marked(markdownProps.content) : '');
</script>

<div class={getBaseClasses('markdown', markdownProps.size)}>
  {#if markdownProps.title}
    <h2 class="markdown-title mb-4 text-2xl font-bold">
      {markdownProps.title}
    </h2>
  {/if}

  {#if markdownProps.content}
    <div class="prose max-w-none">
      {@html renderedContent}
    </div>
  {:else if markdownProps.noDataPrompt}
    <div class="flex flex-col items-center justify-center p-8 text-center">
      <span class="icon-[tabler--file-text] mb-2 size-8"></span>
      <span>{markdownProps.noDataPrompt}</span>
    </div>
  {/if}
</div>
