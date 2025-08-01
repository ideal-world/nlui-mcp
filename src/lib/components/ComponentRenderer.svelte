<script lang="ts">
	import * as m from '../../paraglide/messages';
	import Audio from '../ui/components/audio.svelte';
	import Card from '../ui/components/card.svelte';
	import Chart from '../ui/components/chart.svelte';
	import Form from '../ui/components/form.svelte';
	import Image from '../ui/components/image.svelte';
	import Markdown from '../ui/components/markdown.svelte';
	import Table from '../ui/components/table.svelte';
	import Video from '../ui/components/video.svelte';
	import type { NLUIComponent } from '../ui/nluiProps.types';
	import RenderError from './RenderError.svelte';

	interface Props {
		component: NLUIComponent;
	}

	let { component }: Props = $props();

	let hasError = $state(false);
	let errorMessage = $state('');

	// 验证组件并处理错误
	function validateComponent() {
		try {
			// 验证组件类型和所需属性
			if (component.kind === 'card') {
				if (!component.cardProps) {
					throw new Error('Card component missing cardProps');
				}
			} else if (component.kind === 'table') {
				if (!component.tableProps) {
					throw new Error('Table component missing tableProps');
				}
			} else if (component.kind === 'form') {
				if (!component.formProps) {
					throw new Error('Form component missing formProps');
				}
			} else if (component.kind === 'image') {
				if (!component.imageProps) {
					throw new Error('Image component missing imageProps');
				}
			} else if (component.kind === 'video') {
				if (!component.videoProps) {
					throw new Error('Video component missing videoProps');
				}
			} else if (component.kind === 'audio') {
				if (!component.audioProps) {
					throw new Error('Audio component missing audioProps');
				}
			} else if (component.kind === 'markdown') {
				if (!component.markdownProps) {
					throw new Error('Markdown component missing markdownProps');
				}
			} else if (component.kind === 'chart') {
				if (!component.chartProps) {
					throw new Error('Chart component missing chartProps');
				}
			} else {
				throw new Error(`Unknown component kind: ${component.kind}`);
			}
			// 如果验证通过，设置可以渲染
			hasError = false;
			errorMessage = '';
		} catch (error) {
			// 处理错误
			const errorObj = error instanceof Error ? error : new Error(String(error));
			hasError = true;
			errorMessage = errorObj.message;
		}
	}

	// 当组件变化时重新验证
	$effect(() => {
		validateComponent();
	});
</script>

{#if hasError}
	<RenderError
		errorMessage={m.render_error_title()}
		errorDetails={`Component: ${component.kind} - ${errorMessage}`}
	/>
{:else if component.kind === 'card' && component.cardProps}
	<Card {...component.cardProps} />
{:else if component.kind === 'table' && component.tableProps}
	<Table {...component.tableProps} />
{:else if component.kind === 'form' && component.formProps}
	<Form {...component.formProps} />
{:else if component.kind === 'image' && component.imageProps}
	<Image {...component.imageProps} />
{:else if component.kind === 'video' && component.videoProps}
	<Video {...component.videoProps} />
{:else if component.kind === 'audio' && component.audioProps}
	<Audio {...component.audioProps} />
{:else if component.kind === 'markdown' && component.markdownProps}
	<Markdown {...component.markdownProps} />
{:else if component.kind === 'chart' && component.chartProps}
	<Chart {...component.chartProps} />
{:else}
	<Card
		title="组件开发中 / Component In Development"
		body="组件类型 '{component.kind}' 正在开发中，敬请期待。/ Component type '{component.kind}' is under development, stay tuned."
	/>
{/if}
