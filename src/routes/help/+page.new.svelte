<script lang="ts">
  import ComponentSection from './components/ComponentSection.svelte';
  import ExampleCard from './components/ExampleCard.svelte';
  import * as m from '../../paraglide/messages';

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
      examples: getCardExamples()
    },
    {
      id: 'table',
      title: m.doc_component_table_title(),
      description: m.doc_component_table_description(),
      examples: getTableExamples()
    },
    {
      id: 'form',
      title: m.doc_component_form_title(),
      description: m.doc_component_form_description(),
      examples: getFormExamples()
    },
    {
      id: 'chart',
      title: m.doc_component_chart_title(),
      description: m.doc_component_chart_description(),
      examples: getChartExamples()
    },
    {
      id: 'calendar',
      title: m.doc_component_calendar_title(),
      description: m.doc_component_calendar_description(),
      examples: getCalendarExamples()
    },
    {
      id: 'timeline',
      title: m.doc_component_timeline_title(),
      description: m.doc_component_timeline_description(),
      examples: getTimelineExamples()
    },
    {
      id: 'gallery',
      title: m.doc_component_gallery_title(),
      description: m.doc_component_gallery_description(),
      examples: getGalleryExamples()
    },
    {
      id: 'markdown',
      title: m.doc_component_markdown_title(),
      description: m.doc_component_markdown_description(),
      examples: getMarkdownExamples()
    },
    {
      id: 'image',
      title: m.doc_component_image_title(),
      description: m.doc_component_image_description(),
      examples: getImageExamples()
    },
    {
      id: 'video',
      title: m.doc_component_video_title(),
      description: m.doc_component_video_description(),
      examples: getVideoExamples()
    },
    {
      id: 'audio',
      title: m.doc_component_audio_title(),
      description: m.doc_component_audio_description(),
      examples: getAudioExamples()
    }
  ];
</script>

<div class="bg-base-200 min-h-screen py-8">
  <div class="container mx-auto max-w-6xl px-4">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-base-content mb-4 text-4xl font-bold">
        {m.help_title()}
      </h1>
      <p class="text-base-content/70 text-lg">
        {m.help_description()}
      </p>
    </div>

    <!-- Quick Navigation -->
    <div class="bg-base-100 mb-8 rounded-lg p-6">
      <h2 class="text-base-content mb-4 text-xl font-bold">组件导航</h2>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {#each componentSections as section}
          <a href="#{section.id}" class="btn btn-sm btn-ghost text-sm">
            {section.title}
          </a>
        {/each}
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="bg-base-100 mb-8 rounded-lg p-6">
      <h2 class="text-base-content mb-4 text-2xl font-bold">{m.help_usage_title()}</h2>
      <p class="text-base-content/70 mb-6">{m.help_usage_description()}</p>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-base-200 rounded p-4">
          <h3 class="mb-2 font-semibold">{m.help_url_params()}</h3>
          <p class="text-base-content/70 mb-3 text-sm">{m.help_url_params_description()}</p>
          <div class="bg-base-300 rounded p-3 font-mono text-sm break-all">
            ?nlui={'{'}"showTools":true,"block":{'{'}"main":{'{'}"kind":"card"...{'}'}{'}'}{'}'}
          </div>
        </div>

        <div class="bg-base-200 rounded p-4">
          <h3 class="mb-2 font-semibold">{m.help_session_storage()}</h3>
          <p class="text-base-content/70 mb-3 text-sm">{m.help_session_storage_description()}</p>
          <div class="bg-base-300 rounded p-3 font-mono text-sm">sessionStorage['nluiProp_sessionId']</div>
        </div>
      </div>
    </div>

    <!-- 组件展示区域 -->
    <div class="space-y-8">
      {#each componentSections as section}
        <div id={section.id}>
          <ComponentSection title={section.title} description={section.description}>
            <div class="grid gap-4 lg:grid-cols-2">
              {#each section.examples as example}
                <ExampleCard {example} componentName={section.id} />
              {/each}
            </div>
          </ComponentSection>
        </div>
      {/each}
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center">
      <p class="text-base-content/50 text-sm">NLUI MCP - Natural Language User Interface Framework</p>
    </div>
  </div>
</div>
