<script lang="ts">
  import ExampleCard from './components/ExampleCard.svelte';
  import * as m from '../../paraglide/messages';

  // 导入所有组件
  import Card from '$lib/ui/components/card.svelte';
  import Table from '$lib/ui/components/table.svelte';
  import Form from '$lib/ui/components/form.svelte';
  import Chart from '$lib/ui/components/chart.svelte';
  import Calendar from '$lib/ui/components/calendar.svelte';
  import Timeline from '$lib/ui/components/timeline.svelte';
  import Gallery from '$lib/ui/components/gallery.svelte';
  import Markdown from '$lib/ui/components/markdown.svelte';
  import Image from '$lib/ui/components/image.svelte';
  import Video from '$lib/ui/components/video.svelte';
  import Audio from '$lib/ui/components/audio.svelte';

  // 导入所有组件示例数据
  import { getCardExamples } from './examples/cardExamples';
  import { getTableExamples } from './examples/tableExamples';
  import { getFormExamples } from './examples/formExamples';
  import { getChartExamples } from './examples/chartExamples';
  import { getCalendarExamples } from './examples/calendarExamples';
  import { getTimelineExamples } from './examples/timelineExamples';
  import { getGalleryExamples } from './examples/galleryExamples';
  import { getMarkdownExamples } from './examples/markdownExamples';
  import { getImageExamples } from './examples/imageExamples';
  import { getVideoExamples } from './examples/videoExamples';
  import { getAudioExamples } from './examples/audioExamples';

  const componentSections = [
    {
      id: 'card',
      title: m.doc_component_card_title(),
      description: m.doc_component_card_description(),
      examples: getCardExamples(),
      component: Card
    },
    {
      id: 'table',
      title: m.doc_component_table_title(),
      description: m.doc_component_table_description(),
      examples: getTableExamples(),
      component: Table
    },
    {
      id: 'form',
      title: m.doc_component_form_title(),
      description: m.doc_component_form_description(),
      examples: getFormExamples(),
      component: Form
    },
    {
      id: 'chart',
      title: m.doc_component_chart_title(),
      description: m.doc_component_chart_description(),
      examples: getChartExamples(),
      component: Chart
    },
    {
      id: 'calendar',
      title: m.doc_component_calendar_title(),
      description: m.doc_component_calendar_description(),
      examples: getCalendarExamples(),
      component: Calendar
    },
    {
      id: 'timeline',
      title: m.doc_component_timeline_title(),
      description: m.doc_component_timeline_description(),
      examples: getTimelineExamples(),
      component: Timeline
    },
    {
      id: 'gallery',
      title: m.doc_component_gallery_title(),
      description: m.doc_component_gallery_description(),
      examples: getGalleryExamples(),
      component: Gallery
    },
    {
      id: 'markdown',
      title: m.doc_component_markdown_title(),
      description: m.doc_component_markdown_description(),
      examples: getMarkdownExamples(),
      component: Markdown
    },
    {
      id: 'image',
      title: m.doc_component_image_title(),
      description: m.doc_component_image_description(),
      examples: getImageExamples(),
      component: Image
    },
    {
      id: 'video',
      title: m.doc_component_video_title(),
      description: m.doc_component_video_description(),
      examples: getVideoExamples(),
      component: Video
    },
    {
      id: 'audio',
      title: m.doc_component_audio_title(),
      description: m.doc_component_audio_description(),
      examples: getAudioExamples(),
      component: Audio
    }
  ];
</script>

<div class="from-base-100 via-base-200/30 to-base-300/20 relative min-h-screen bg-gradient-to-br">
  <!-- 固定在顶部的组件导航 -->
  <div class="bg-base-100/95 border-base-300/50 fixed top-0 right-0 left-0 z-10 border-b shadow-sm backdrop-blur-md">
    <div class="container mx-auto px-4 py-3">
      <nav class="flex flex-wrap justify-center gap-2">
        {#each componentSections as section}
          <a href="#{section.id}" class="btn btn-sm btn-ghost hover:btn-primary text-xs transition-all duration-200">
            {section.title}
          </a>
        {/each}
      </nav>
    </div>
  </div>

  <div class="container mx-auto px-4 pt-24 pb-12">
    <!-- 页面标题和说明 -->
    <div class="mb-12 text-center">
      <div class="bg-primary/10 mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full">
        <span class="icon-[lucide--book-open] text-primary size-10"></span>
      </div>
      <h1 class="from-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
        {m.help_title()}
      </h1>
      <p class="text-base-content/80 mx-auto mb-8 max-w-3xl text-xl leading-relaxed">
        {m.help_description()}
      </p>
    </div>

    <!-- 使用说明 -->
    <div class="mx-auto mb-12 max-w-5xl">
      <div class="card from-info/5 to-primary/5 border-info/20 border bg-gradient-to-r shadow-lg">
        <div class="card-body p-6">
          <div class="mb-4 flex items-center gap-3">
            <div class="bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <span class="icon-[lucide--lightbulb] text-info size-5"></span>
            </div>
            <h2 class="card-title text-info text-xl">{m.help_usage_title()}</h2>
          </div>

          <div class="prose text-base-content max-w-none">
            <p class="text-base-content/80 mb-6 text-base leading-relaxed">{m.help_usage_description()}</p>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="from-base-100 to-base-200/50 border-base-300/30 rounded-xl border bg-gradient-to-br p-5">
                <div class="mb-3 flex items-center gap-2">
                  <span class="icon-[lucide--link] text-primary size-5"></span>
                  <h3 class="text-base-content text-base font-semibold">{m.help_url_params()}</h3>
                </div>
                <p class="text-base-content/70 mb-4 text-sm leading-relaxed">{m.help_url_params_description()}</p>
                <div class="bg-base-300/20 text-base-content border-base-300/30 rounded-lg border p-3 font-mono text-sm break-all">
                  ?nlui={'{'}"showTools":true,"block":{'{'}"main":{'{'}"kind":"card"...{'}'}{'}'}{'}'}
                </div>
              </div>

              <div class="from-base-100 to-base-200/50 border-base-300/30 rounded-xl border bg-gradient-to-br p-5">
                <div class="mb-3 flex items-center gap-2">
                  <span class="icon-[lucide--database] text-secondary size-5"></span>
                  <h3 class="text-base-content text-base font-semibold">{m.help_session_storage()}</h3>
                </div>
                <p class="text-base-content/70 mb-4 text-sm leading-relaxed">{m.help_session_storage_description()}</p>
                <div class="bg-base-300/20 text-base-content border-base-300/30 rounded-lg border p-3 font-mono text-sm">sessionStorage['nluiProp_sessionId']</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 组件文档 -->
    <div class="mx-auto max-w-7xl space-y-12">
      {#each componentSections as section, index}
        <section id={section.id} class="scroll-mt-24">
          <div class="card from-base-100/80 to-base-200/30 border-base-300/30 border bg-gradient-to-br shadow-xl backdrop-blur-sm">
            <div class="card-body p-8">
              <!-- 组件标题区域 -->
              <div class="mb-8 flex items-start gap-4">
                <div class="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                  <span class="text-2xl">
                    {#if section.id === 'card'}📄
                    {:else if section.id === 'table'}📊
                    {:else if section.id === 'form'}📝
                    {:else if section.id === 'chart'}📈
                    {:else if section.id === 'calendar'}📅
                    {:else if section.id === 'timeline'}📋
                    {:else if section.id === 'gallery'}🖼️
                    {:else if section.id === 'markdown'}📄
                    {:else if section.id === 'image'}🖼️
                    {:else if section.id === 'video'}🎥
                    {:else if section.id === 'audio'}🎵
                    {:else}🔧{/if}
                  </span>
                </div>
                <div class="flex-1">
                  <h2 class="text-primary mb-2 text-3xl font-bold">
                    {section.title}
                  </h2>
                  <p class="text-base-content/80 text-lg leading-relaxed">{section.description}</p>
                </div>
              </div>

              <!-- 实时组件预览 -->
              <div class="mb-8">
                <div class="mb-6 flex items-center gap-2">
                  <span class="icon-[lucide--eye] text-success size-5"></span>
                  <h3 class="text-base-content text-lg font-semibold">实时预览</h3>
                  <div class="badge badge-success badge-sm">
                    {Math.min(3, section.examples.length)} 个预览
                  </div>
                </div>

                <!-- 多个实时预览 -->
                <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {#each section.examples.slice(0, 3) as example, idx}
                    <div class="border-base-300/30 bg-base-100/50 overflow-hidden rounded-xl border">
                      <div class="bg-base-200/30 text-base-content/80 border-base-300/30 border-b px-4 py-2 text-sm font-medium">
                        {example.title || `示例 ${idx + 1}`}
                      </div>
                      <div class="p-4">
                        {#if section.id === 'table'}
                          <!-- 表格组件特殊处理 -->
                          <div class="overflow-x-auto">
                            <!-- @ts-ignore -->
                            <svelte:component this={section.component} {...example} />
                          </div>
                        {:else if section.id === 'timeline'}
                          <!-- 时间轴组件限制宽度 -->
                          <div class="mx-auto max-w-md">
                            <!-- @ts-ignore -->
                            <svelte:component this={section.component} {...example} />
                          </div>
                        {:else}
                          <!-- 其他组件正常显示 -->
                          <!-- @ts-ignore -->
                          <svelte:component this={section.component} {...example} />
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- 示例展示区域 -->
              <div>
                <div class="mb-6 flex items-center gap-2">
                  <span class="icon-[lucide--layers] text-accent size-5"></span>
                  <h3 class="text-base-content text-lg font-semibold">示例展示</h3>
                  <div class="badge badge-primary badge-sm">{section.examples.length} 个示例</div>
                </div>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {#each section.examples as example}
                    <ExampleCard {example} componentName={section.id} />
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </section>
      {/each}
    </div>

    <!-- 页脚信息 -->
    <div class="border-base-300/30 mt-16 border-t pt-8 text-center">
      <div class="text-base-content/60 mb-2 flex items-center justify-center gap-2">
        <span class="icon-[lucide--heart] size-4"></span>
        <p class="text-sm">NLUI MCP - Natural Language User Interface Framework</p>
      </div>
      <p class="text-base-content/40 text-xs">为现代Web应用提供智能UI组件解决方案</p>
    </div>
  </div>
</div>
