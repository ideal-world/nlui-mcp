<script lang="ts">
  interface Props {
    example: any;
    componentName: string;
  }

  const { example, componentName }: Props = $props();

  import { saveNLUIPropsToSession } from '$lib/client/nluiPropProcessor';
  import type { NLUIProps } from '$lib/ui/nluiProps.types';
  import * as m from '../../../paraglide/messages';

  // 生成唯一的示例ID
  function generateExampleId() {
    return `example_${componentName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function tryExample() {
    const exampleId = generateExampleId();

    const exampleProp: NLUIProps = {
      showTools: true,
      showDebug: true,
      block: {
        main: {
          kind: componentName as any,
          [`${componentName}Props`]: example
        }
      }
    };

    // 保存到sessionStorage
    saveNLUIPropsToSession(exampleProp, exampleId);

    // 在新窗口打开
    const url = `/?sessionId=${exampleId}`;
    window.open(url, '_blank', 'width=1200,height=800,resizable=yes,scrollbars=yes');
  }
</script>

<div class="card from-base-100 to-base-200/50 border-base-300/50 hover:border-primary/20 border bg-gradient-to-br transition-all duration-300 hover:shadow-md">
  <div class="card-body p-5">
    <div class="mb-4 flex items-start justify-between">
      <div class="flex-1">
        <h4 class="card-title text-base-content mb-1 text-base font-semibold">
          {example.title || `${componentName} 示例`}
        </h4>
        {#if example.description}
          <p class="text-base-content/70 text-sm leading-relaxed">{example.description}</p>
        {/if}
      </div>
      <button class="btn btn-sm btn-primary btn-outline hover:btn-primary ml-3 gap-1 transition-all duration-200" onclick={tryExample} title="在新窗口中查看此示例">
        <span class="icon-[lucide--external-link] size-3"></span>
        {m.help_try_example()}
      </button>
    </div>

    <!-- 显示配置参数预览 -->
    <div class="bg-base-100/60 border-base-300/30 overflow-hidden rounded-lg border">
      <details class="group">
        <summary class="text-base-content/80 hover:text-base-content hover:bg-base-200/30 cursor-pointer list-none p-3 text-sm transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="icon-[lucide--code] size-4"></span>
              <span class="font-medium">{m.view_config_params()}</span>
            </div>
            <span class="icon-[lucide--chevron-down] size-4 transition-transform duration-200 group-open:rotate-180"></span>
          </div>
        </summary>
        <div class="border-base-300/20 bg-base-200/20 border-t">
          <pre class="text-base-content/70 overflow-x-auto p-3 text-xs leading-relaxed">{JSON.stringify(example, null, 2)}</pre>
        </div>
      </details>
    </div>
  </div>
</div>
