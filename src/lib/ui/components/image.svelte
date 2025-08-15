<script lang="ts">
  import type { NLUIImageComponentProps } from './image.types.js';

  let imageProps: NLUIImageComponentProps = $props();
</script>

<img src={imageProps.src} class="w-full" alt={imageProps.title || ''} />
