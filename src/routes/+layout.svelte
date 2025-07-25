<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import '../app.css';
  import * as m from '../paraglide/messages';

  afterNavigate(() => {
    window.HSStaticMethods.autoInit();
  });

  let { children } = $props();
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{m.app_title()}</title>
  <meta name="description" content={m.app_description()} />
</svelte:head>

<main>
  {@render children()}
</main>
