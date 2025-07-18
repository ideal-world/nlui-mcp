<script lang="ts">
	import Alert from '../ui/components/alert.svelte';
	import Card from '../ui/components/card.svelte';
	import Form from '../ui/components/form.svelte';
	import List from '../ui/components/list.svelte';
	import Table from '../ui/components/table.svelte';
	import type { NLUIComponent } from '../ui/nluiProps.types';
	import RenderError from './RenderError.svelte';
	import * as m from '../../paraglide/messages';

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
			} else if (component.kind === 'list') {
				if (!component.listProps) {
					throw new Error('List component missing listProps');
				}
			} else if (component.kind === 'alert') {
				if (!component.alertProps) {
					throw new Error('Alert component missing alertProps');
				}
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
{:else if component.kind === 'list' && component.listProps}
	<List {...component.listProps} />
{:else if component.kind === 'alert' && component.alertProps}
	<Alert {...component.alertProps} />
{:else}
	<!-- fallback for unknown types -->
	<Card
		title="组件开发中 / Component In Development"
		body="组件类型 '{component.kind}' 正在开发中，敬请期待。/ Component type '{component.kind}' is under development, stay tuned."
	/>
{/if}
