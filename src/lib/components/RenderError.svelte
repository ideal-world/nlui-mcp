<script lang="ts">
  import * as m from '../../paraglide/messages';

  interface Props {
    errorMessage: string;
    errorDetails?: string;
  }

  let { errorMessage, errorDetails }: Props = $props();

  function goToHelp() {
    if (typeof window !== 'undefined') {
      const sessionKeys = Object.keys(sessionStorage).filter((key) => key.startsWith('nluiProp_'));
      sessionKeys.forEach((key) => sessionStorage.removeItem(key));
      window.location.href = `${window.location.origin}/help`;
    }
  }
</script>

<!-- 渲染错误状态 / Render Error State -->
<div class="bg-base-200 min-h-screen p-8">
  <div class="mx-auto max-w-4xl">
    <div class="mb-12 text-center">
      <h1 class="text-base-content mb-4 text-4xl font-bold md:text-6xl">
        {m.main_title()}
      </h1>
      <p class="text-base-content/70 mb-8 text-xl">
        {m.main_subtitle()}
      </p>
    </div>

    <!-- 错误提示卡片 / Error Alert Card -->
    <div class="bg-base-100 mx-auto max-w-2xl rounded-lg p-6 shadow-lg">
      <div class="mb-6 text-center">
        <div class="text-error bg-error/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 class="text-base-content mb-2 text-2xl font-bold">{errorMessage}</h2>
        <p class="text-base-content/70">{m.render_error_description()}</p>
      </div>

      {#if errorDetails}
        <div class="mb-6">
          <details class="collapse-arrow bg-base-200 collapse">
            <summary class="collapse-title text-base-content font-medium">
              {m.render_error_details()}
            </summary>
            <div class="collapse-content">
              <pre class="text-error bg-base-100 max-h-40 overflow-auto rounded p-3 text-sm">{errorDetails}</pre>
            </div>
          </details>
        </div>
      {/if}

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button class="btn btn-outline" onclick={goToHelp}>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {m.render_error_go_to_help()}
        </button>
      </div>
    </div>
  </div>
</div>
