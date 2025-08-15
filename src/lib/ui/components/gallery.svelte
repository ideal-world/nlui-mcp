<script lang="ts">
  import * as m from '../../../paraglide/messages.js';
  import { formatUri, getBaseClasses } from '../common/base.utils.js';
  import type { NLUIGalleryComponentProps } from './gallery.types.js';

  const galleryProps: NLUIGalleryComponentProps = $props();
  const carouselConfig = JSON.stringify({ loadingClasses: 'opacity-0', dotsItemClasses: 'carousel-box carousel-active:bg-primary' });
</script>

<div class={getBaseClasses('', galleryProps.size)}>
  {#if galleryProps.title}
    <h2 class="mb-4 text-2xl font-bold">{galleryProps.title}</h2>
  {/if}
  {#if !galleryProps.items || galleryProps.items.length === 0}
    <div class="text-base-content/50 flex flex-col items-center justify-center py-12">
      <span class="icon-[tabler--photo] mb-2 size-8"></span>
      <span>{galleryProps.noDataPrompt || m.gallery_no_data?.() || 'No images available'}</span>
    </div>
  {:else}
    <div data-carousel={carouselConfig} class="relative w-full">
      <div class="carousel">
        <div class="carousel-body h-3/4 opacity-0">
          {#each galleryProps.items as item}
            <div class="carousel-slide">
              <div class="relative flex size-full justify-center">
                {#if galleryProps.action}
                  <a href={formatUri(galleryProps.action.linkUrl, item)}>
                    <img src={item.src} class="size-full object-cover" alt={item.caption || ''} />
                  </a>
                {:else}
                  <img src={item.src} class="size-full object-cover" alt={item.caption || ''} />
                {/if}
                {#if item.caption}
                  <div class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <p>{item.caption}</p>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <button type="button" class="carousel-prev carousel-disabled:opacity-50 bg-base-100 shadow-base-300/20 start-5 flex size-9.5 items-center justify-center rounded-full shadow-sm max-sm:start-3">
          <span class="icon-[tabler--chevron-left] size-5"></span>
          <span class="sr-only">Previous</span>
        </button>
        <button type="button" class="carousel-next carousel-disabled:opacity-50 bg-base-100 shadow-base-300/20 end-5 flex size-9.5 items-center justify-center rounded-full shadow-sm max-sm:end-3">
          <span class="icon-[tabler--chevron-right] size-5"></span>
          <span class="sr-only">Next</span>
        </button>
        <div class="carousel-pagination absolute start-0 end-0 bottom-3 flex justify-center gap-3"></div>
      </div>
    </div>
  {/if}
</div>
