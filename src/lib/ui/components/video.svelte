<script lang="ts">
  import * as m from '../../../paraglide/messages.js';
  import type { NLUIVideoComponentProps } from './video.types.js';

  let videoProps: NLUIVideoComponentProps = $props();
</script>

<video src={videoProps.src} poster={videoProps.poster} controls aria-label={videoProps.title || ''} class="h-auto w-full">
  <track kind="captions" />
  {m.video_not_supported?.() || 'Sorry, your browser does not support embedded videos.'}
</video>
