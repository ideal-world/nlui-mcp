<script lang="ts">
	import NLUIHelp from '$lib/components/Help.svelte';
	import * as m from '../../paraglide/messages';
</script>

<svelte:head>
	<title>{m.help_page_title()}</title>
	<meta name="description" content={m.help_page_description()} />
</svelte:head>

<NLUIHelp />
