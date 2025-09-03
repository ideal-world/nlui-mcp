<script lang="ts">
  interface Props {
    example: any;
    title: string;
    description?: string;
  }

  const { example, title, description }: Props = $props();

  import { saveNLUIPropsToSession } from '$lib/client/nluiPropProcessor';
  import type { NLUIProps } from '$lib/ui/nluiProps.types';
  import * as m from '../../../paraglide/messages';

  // 生成唯一的示例ID
  function generateExampleId() {
    return `layout_example_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function tryExample() {
    const exampleId = generateExampleId();

    // example 已经是一个完整的 NLUIProps 对象
    const exampleProp: NLUIProps = {
      showTools: true,
      showDebug: true,
      ...example // 扩展传入的配置
    };

    // 保存到sessionStorage
    saveNLUIPropsToSession(exampleProp, exampleId);

    // 在新窗口打开
    const url = `/?sessionId=${exampleId}`;
    window.open(url, '_blank', 'width=1200,height=800,resizable=yes,scrollbars=yes');
  }

  // 渲染布局预览的函数
  function renderLayoutPreview(config: any) {
    const areas = [];
    // 从config.block中获取布局信息
    const block = config.block || config;
    if (block.header) areas.push('header');
    if (block.left) areas.push('left');
    if (block.main) areas.push('main');
    if (block.right) areas.push('right');
    if (block.footer) areas.push('footer');
    return areas;
  }

  // 生成CSS Grid模板
  function generateGridTemplate(areas: string[]) {
    let template = '';
    let rows = '';

    if (areas.includes('header')) {
      template += '"header header header" ';
      rows += 'auto ';
    }

    // 中间行
    if (areas.includes('left') && areas.includes('main') && areas.includes('right')) {
      template += '"left main right" ';
    } else if (areas.includes('left') && areas.includes('main')) {
      template += '"left main main" ';
    } else if (areas.includes('main') && areas.includes('right')) {
      template += '"main main right" ';
    } else {
      template += '"main main main" ';
    }
    rows += '1fr ';

    if (areas.includes('footer')) {
      template += '"footer footer footer"';
      rows += 'auto';
    }

    return { template: template.trim(), rows: rows.trim() };
  }

  const layoutAreas = $derived(renderLayoutPreview(example));
  const gridStyle = $derived(generateGridTemplate(layoutAreas));
</script>

<div class="card from-base-100 to-base-200/50 border-base-300/50 hover:border-primary/20 border bg-gradient-to-br transition-all duration-300 hover:shadow-md">
  <div class="card-body p-5">
    <div class="mb-4 flex items-start justify-between">
      <div class="flex-1">
        <h4 class="card-title text-base-content mb-1 text-base font-semibold">
          {title}
        </h4>
        {#if description}
          <p class="text-base-content/70 text-sm leading-relaxed">{description}</p>
        {/if}
      </div>
      <button class="btn btn-sm btn-primary btn-outline hover:btn-primary ml-3 gap-1 transition-all duration-200" onclick={tryExample} title={m.try_layout_example()}>
        <span class="icon-[lucide--external-link] size-3"></span>
        {m.help_try_example()}
      </button>
    </div>

    <!-- 布局预览区域 -->
    <div class="mb-4">
      <div class="bg-base-200/30 border-base-300/30 relative h-32 overflow-hidden rounded-lg border p-2">
        <div class="grid h-full gap-1" style="grid-template-areas: {gridStyle.template}; grid-template-columns: 1fr 3fr 1fr; grid-template-rows: {gridStyle.rows};">
          {#if layoutAreas.includes('header')}
            <div class="bg-primary/20 border-primary/30 flex items-center justify-center rounded border text-xs font-medium" style="grid-area: header;">
              {m.layout_area_header()}
            </div>
          {/if}
          {#if layoutAreas.includes('left')}
            <div class="bg-secondary/20 border-secondary/30 flex items-center justify-center rounded border text-xs font-medium" style="grid-area: left;">
              {m.layout_area_left()}
            </div>
          {/if}
          {#if layoutAreas.includes('main')}
            <div class="bg-accent/20 border-accent/30 flex items-center justify-center rounded border text-xs font-medium" style="grid-area: main;">
              {m.layout_area_main()}
            </div>
          {/if}
          {#if layoutAreas.includes('right')}
            <div class="bg-info/20 border-info/30 flex items-center justify-center rounded border text-xs font-medium" style="grid-area: right;">
              {m.layout_area_right()}
            </div>
          {/if}
          {#if layoutAreas.includes('footer')}
            <div class="bg-warning/20 border-warning/30 flex items-center justify-center rounded border text-xs font-medium" style="grid-area: footer;">
              {m.layout_area_footer()}
            </div>
          {/if}
        </div>
      </div>
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
