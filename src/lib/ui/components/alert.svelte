<script lang="ts">
	import type { NLUIAlertComponentProps } from './alert.types.js';
	import { logger } from '../../utils/logger';
	import { ErrorHandler } from '../../utils/errorHandler';
	import * as m from '../../../paraglide/messages';

	let alertProps: NLUIAlertComponentProps = $props();

	// 解构警告属性
	const {
		type = 'info',
		variant = 'filled',
		title,
		message,
		closable = false,
		onCloseLink,
		showIcon = true
	} = alertProps;

	// 警告显示状态
	let isVisible = $state(true);

	/**
	 * 类型样式映射
	 * Type style mapping
	 */
	const typeClasses: Record<string, string> = {
		info: 'alert-info',
		success: 'alert-success',
		warning: 'alert-warning',
		error: 'alert-error'
	};

	/**
	 * 变体样式映射
	 * Variant style mapping
	 */
	const variantClasses: Record<string, string> = {
		filled: '',
		outlined: 'alert-outlined',
		soft: 'alert-soft',
		ghost: 'alert-ghost'
	};

	/**
	 * 图标映射
	 * Icon mapping
	 */
	const iconClasses: Record<string, string> = {
		info: 'i-lucide-info',
		success: 'i-lucide-check-circle',
		warning: 'i-lucide-alert-triangle',
		error: 'i-lucide-x-circle'
	};

	/**
	 * 获取 Alert 样式类
	 * Get Alert style classes
	 */
	function getAlertClasses(): string {
		const classes = ['alert', typeClasses[type], variantClasses[variant]].filter(Boolean);
		return classes.join(' ');
	}

	/**
	 * 处理关闭事件
	 * Handle close event
	 */
	function handleClose(): void {
		try {
			logger.info('Alert closed', {
				component: 'AlertComponent',
				action: 'close',
				metadata: {
					type,
					hasTitle: !!title,
					hasCloseLink: !!onCloseLink
				}
			});

			isVisible = false;

			if (onCloseLink) {
				window.open(onCloseLink, '_blank', 'noopener,noreferrer');
			}
		} catch (error) {
			ErrorHandler.handle(error, {
				component: 'AlertComponent',
				action: 'close',
				metadata: { type }
			});
		}
	}

	/**
	 * 获取图标元素
	 * Get icon element
	 */
	function getIconElement(): string {
		const iconMap: Record<string, string> = {
			info: '💡',
			success: '✅',
			warning: '⚠️',
			error: '❌'
		};
		return iconMap[type] || iconMap.info;
	}

	/**
	 * 检查内容是否为空
	 * Check if content is empty
	 */
	function isContentEmpty(content: string | undefined | null): boolean {
		return !content || content.trim().length === 0;
	}

	/**
	 * 获取可访问性角色
	 * Get accessibility role
	 */
	function getAriaRole(): string {
		return type === 'error' ? 'alert' : 'status';
	}

	// 记录警告渲染
	logger.debug('Alert component rendered', {
		component: 'AlertComponent',
		action: 'render',
		metadata: {
			type,
			variant,
			hasTitle: !isContentEmpty(title),
			hasMessage: !isContentEmpty(message),
			isClosable: closable,
			showIcon
		}
	});
</script>

<!-- 警告容器 / Alert Container -->
{#if isVisible}
	<div class={getAlertClasses()} role={getAriaRole()}>
		<!-- 警告图标 / Alert Icon -->
		{#if showIcon}
			<div class="text-2xl" aria-hidden="true">
				{getIconElement()}
			</div>
		{/if}

		<!-- 警告内容 / Alert Content -->
		<div class="flex-1">
			<!-- 警告标题 / Alert Title -->
			{#if !isContentEmpty(title)}
				<h3 class="mb-1 text-lg font-bold">
					{title}
				</h3>
			{/if}

			<!-- 警告消息 / Alert Message -->
			{#if !isContentEmpty(message)}
				<div class="text-sm">
					{@html message}
				</div>
			{/if}

			<!-- 空内容提示 / Empty Content Warning -->
			{#if isContentEmpty(title) && isContentEmpty(message)}
				<div class="text-base-content/60 text-sm">
					{m.alert_no_content()}
				</div>
			{/if}
		</div>

		<!-- 关闭按钮 / Close Button -->
		{#if closable}
			<button
				type="button"
				class="btn btn-ghost btn-sm btn-square ml-auto"
				onclick={handleClose}
				aria-label={m.alert_close()}
				title={m.alert_close()}
			>
				<span class="text-lg" aria-hidden="true">✕</span>
			</button>
		{/if}
	</div>
{/if}
