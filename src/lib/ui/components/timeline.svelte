<script lang="ts">
  import * as m from '../../../paraglide/messages.js';
  import { formatUri, getSmallerSizeClassSuffix } from '../common/base.utils.js';
  import type { NLUITimelineComponentProps } from './timeline.types.js';

  let timelineProps: NLUITimelineComponentProps = $props();

  function statusIcon(status?: string): string {
    switch (status) {
      case 'success':
        return 'icon-[tabler--progress-check]';
      case 'warning':
        return 'icon-[tabler--progress-alert]';
      case 'error':
        return 'icon-[tabler--progress-x]';
      default:
        return 'icon-[tabler--progress]';
    }
  }

  function statusBadge(status?: string): string {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      default:
        return '';
    }
  }
</script>

<div class="w-full">
  {#if timelineProps.title}
    <div class="text-base-content p-5 text-left font-bold">
      {timelineProps.title}
    </div>
  {/if}

  {#if timelineProps.items.length === 0}
    <div class="text-base-content/60 py-8 text-center">
      {timelineProps.noDataPrompt || m.list_no_data?.()}
    </div>
  {:else}
    <ul class="timeline timeline-{timelineProps.direction ?? 'horizontal'} {timelineProps.size ? 'text-' + getSmallerSizeClassSuffix(timelineProps.size) : ''}">
      {#each timelineProps.items as item, idx}
        <li>
          <div class="timeline-start">{item.time}</div>
          <div class="timeline-middle">
            <span class="badge {statusBadge(item.status)} size-4.5 rounded-full p-0">
              <span class="{statusIcon(item.status)} text-primary-content size-3.5"></span>
            </span>
          </div>

          <div class="timeline-end timeline-box">
            <p class="mb-1 font-semibold">
              {#if timelineProps.action}
                <a href={formatUri(timelineProps.action.linkUrl, item)} class="text-primary">
                  {item.title}
                </a>
              {:else}
                {item.title}
              {/if}
            </p>
            {#if item.description}
              <p class="font-light">{item.description}</p>
            {/if}
          </div>
          {#if idx < timelineProps.items.length - 1}
            <hr />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
