<script lang="ts">
  import UIContainer from '../../../lib/components/UIContainer.svelte';
  import type { NLUIProps } from '../../../lib/ui/nluiProps.types';

  interface Props {
    config: NLUIProps;
    title: string;
    description: string;
  }

  let { config, title, description }: Props = $props();
</script>

<div class="border-base-300 rounded-lg border p-4">
  <div class="mb-4">
    <h3 class="text-base-content mb-2 text-lg font-semibold">{title}</h3>
    <p class="text-base-content/70 text-sm">{description}</p>
  </div>

  <!-- 布局预览区域 -->
  <div class="bg-base-100 border-base-300 overflow-hidden rounded-md border" style="height: 400px;">
    <UIContainer nluiProp={config} />
  </div>

  <!-- 配置代码展示 -->
  <details class="mt-4">
    <summary class="text-primary hover:text-primary-focus cursor-pointer text-sm font-medium"> 查看配置代码 </summary>
    <div class="mt-2">
      <pre class="bg-base-200 overflow-auto rounded p-3 text-xs"><code>{JSON.stringify(config, null, 2)}</code></pre>
    </div>
  </details>
</div>
