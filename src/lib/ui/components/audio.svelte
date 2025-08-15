<script lang="ts">
  import * as m from '../../../paraglide/messages.js';
  import type { NLUIAudioComponentProps } from './audio.types.js';

  let audioProps: NLUIAudioComponentProps = $props();
</script>

<audio src={audioProps.src} controls class="w-full" aria-label={audioProps.title || 'Audio'}>
  {m.audio_not_supported?.() || 'Sorry, your browser does not support the audio element.'}
</audio>
