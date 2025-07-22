<script lang="ts">
	import type { NLUIAudioComponentProps } from './audio.types.js';

	let audioProps: NLUIAudioComponentProps = $props();
</script>

<audio src={audioProps.src} controls class="w-full" aria-label={audioProps.title || 'Audio'}>
	Sorry, your browser does not support the audio element.
</audio>
