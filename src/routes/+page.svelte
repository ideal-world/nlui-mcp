<script lang="ts">
	import { getNLUIProps } from '$lib/client/nluiPropProcessor';
	import NLUIContainer from '$lib/components/UIContainer.svelte';
	import RenderError from '$lib/components/RenderError.svelte';
	import type { NLUIProps } from '$lib/ui/nluiProps.types';
	import * as m from '../paraglide/messages';

	let nluiProp: NLUIProps | null = $state(null);
	let isLoading = $state(true);
	let renderError: string = $state('');
	let errorDetails: string = $state('');

	$effect(() => {
		if (typeof window !== 'undefined' && isLoading) {
			try {
				nluiProp = getNLUIProps();
				renderError = '';
				errorDetails = '';
			} catch (error) {
				console.error('Error loading NLUI prop:', error);
				renderError = m.render_error_title();
				errorDetails = error instanceof Error ? error.message : String(error);
				nluiProp = null;
			} finally {
				isLoading = false;
			}
		}
	});
</script>

<svelte:head>
	<title>{m.app_title()}</title>
	<meta name="description" content={m.app_description()} />
</svelte:head>

{#if isLoading}
	<!-- 加载状态 / Loading State -->
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

			<div class="mb-8 flex items-center justify-center gap-4">
				<span class="loading loading-dots loading-lg"></span>
			</div>

			<div class="text-center">
				<p class="text-base-content/70">Loading...</p>
			</div>
		</div>
	</div>
{:else if renderError}
	<!-- 渲染错误状态 / Render Error State -->
	<RenderError errorMessage={renderError} {errorDetails} />
{:else if nluiProp}
	<!-- 显示NLUI容器 / Show NLUI Container -->
	<NLUIContainer {nluiProp} />
{/if}
