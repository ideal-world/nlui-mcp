<script lang="ts">
	import { getBaseClasses, handleAction } from '../common/base.utils.js';
	import type { NLUICardComponentProps } from './card.types.js';

	let cardProps: NLUICardComponentProps = $props();
</script>

<div class={getBaseClasses('card', cardProps.size)}>
	{#if cardProps.image}
		<figure>
			<img
				src={cardProps.image}
				alt=""
				class="transition-transform duration-500 group-hover:scale-110"
			/>
		</figure>
	{/if}

	<div class="card-body">
		{#if cardProps.title}
			<h2 class="card-title">
				{cardProps.title}
			</h2>
		{/if}

		{#if cardProps.body}
			<p>
				{@html cardProps.body}
			</p>
		{:else if cardProps.noDataPrompt}
			<span class="icon-[tabler--brand-google-drive] mb-2 size-8"></span>
			<span>{cardProps.noDataPrompt}</span>
		{/if}

		{#if cardProps.footer}
			<div class="text-base-content/50">
				{cardProps.footer}
			</div>
		{/if}

		{#if cardProps.primaryAction || cardProps.secondaryAction}
			<div class="card-actions">
				{#if cardProps.primaryAction}
					<button
						class="btn btn-primary"
						onclick={async () => await handleAction('card', cardProps.primaryAction!)}
					>
						{cardProps.primaryAction.label}
					</button>
				{/if}
				{#if cardProps.secondaryAction}
					<button
						class="btn btn-secondary"
						onclick={async () => await handleAction('card', cardProps.secondaryAction!)}
					>
						{cardProps.secondaryAction.label}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
