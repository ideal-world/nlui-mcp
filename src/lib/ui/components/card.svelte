<script lang="ts">
	import type { NLUICardComponentProps } from './card.types.js';
	import { logger } from '../../utils/logger';
	import { ErrorHandler } from '../../utils/errorHandler';
	import * as m from '../../../paraglide/messages';

	let cardProps: NLUICardComponentProps = $props();

	// 解构卡片属性
	const {
		title,
		body,
		footer,
		image,
		horizontal = false,
		primaryAction,
		secondaryAction,
		size = 'md'
	} = cardProps;

	/**
	 * 尺寸样式类映射
	 * Size class mapping
	 */
	const sizeClasses: Record<string, string> = {
		xs: 'card-xs',
		sm: 'card-sm',
		md: '',
		lg: 'card-lg',
		xl: 'card-xl'
	};

	/**
	 * 处理操作按钮点击
	 * Handle action button click
	 */
	function handleAction(
		action: { label: string; onClickLink?: string },
		actionType: 'primary' | 'secondary'
	): void {
		try {
			logger.info('Card action clicked', {
				component: 'CardComponent',
				action: 'buttonClick',
				metadata: {
					actionLabel: action.label,
					actionType,
					hasLink: !!action.onClickLink
				}
			});

			if (action.onClickLink) {
				window.open(action.onClickLink, '_blank', 'noopener,noreferrer');
			}
		} catch (error) {
			ErrorHandler.handle(error, {
				component: 'CardComponent',
				action: 'buttonClick',
				metadata: { actionLabel: action.label, actionType }
			});
		}
	}

	/**
	 * 生成卡片样式类
	 * Generate card class names
	 */
	function getCardClasses(): string {
		const classes = [
			'card',
			'bg-base-100',
			'shadow-xl',
			'transition-all',
			'duration-200',
			'hover:shadow-2xl',
			sizeClasses[size],
			horizontal ? 'card-side' : ''
		].filter(Boolean);

		return classes.join(' ');
	}

	/**
	 * 检查内容是否为空
	 * Check if content is empty
	 */
	function isContentEmpty(content: string | undefined | null): boolean {
		return !content || content.trim().length === 0;
	}

	/**
	 * 获取按钮样式类
	 * Get button style classes
	 */
	function getButtonClass(isPrimary: boolean): string {
		return isPrimary ? 'btn btn-primary' : 'btn btn-outline';
	}

	// 记录卡片渲染
	logger.debug('Card component rendered', {
		component: 'CardComponent',
		action: 'render',
		metadata: {
			hasTitle: !isContentEmpty(title),
			hasBody: !isContentEmpty(body),
			hasImage: !!image,
			hasActions: !!(primaryAction || secondaryAction),
			isHorizontal: horizontal
		}
	});
</script>

<!-- 卡片容器 / Card Container -->
<div class={getCardClasses()}>
	<!-- 卡片图片 / Card Image -->
	{#if image}
		<figure class={horizontal ? 'w-1/3' : ''}>
			<img src={image} alt="" class="h-full w-full object-cover" loading="lazy" />
		</figure>
	{/if}

	<!-- 卡片内容 / Card Content -->
	<div class="card-body">
		<!-- 卡片标题 / Card Title -->
		{#if !isContentEmpty(title)}
			<h2 class="card-title">
				{title}
			</h2>
		{/if}

		<!-- 卡片正文 / Card Body -->
		{#if !isContentEmpty(body)}
			<div class="text-base-content/80">
				{@html body}
			</div>
		{/if}

		<!-- 卡片底部 / Card Footer -->
		{#if !isContentEmpty(footer)}
			<div class="text-base-content/60 mt-4 text-sm">
				{footer}
			</div>
		{/if}

		<!-- 卡片操作按钮 / Card Actions -->
		{#if primaryAction || secondaryAction}
			<div class="card-actions mt-4 justify-end">
				{#if secondaryAction}
					<button
						type="button"
						class={getButtonClass(false)}
						onclick={() => handleAction(secondaryAction, 'secondary')}
						title={secondaryAction.label}
					>
						{secondaryAction.label}
					</button>
				{/if}

				{#if primaryAction}
					<button
						type="button"
						class={getButtonClass(true)}
						onclick={() => handleAction(primaryAction, 'primary')}
						title={primaryAction.label}
					>
						{primaryAction.label}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
