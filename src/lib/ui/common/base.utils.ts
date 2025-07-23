import { apiClient } from '$lib/utils/apiClient';
import { ErrorHandler } from '$lib/utils/errorHandler';
import { logger } from '$lib/utils/logger';
import type { ApiActionProps, LinkActionProps } from './base.types';

export function getBaseClasses(componentName: string, size: string = ''): string {
	return `${componentName} ${getSizeClass(componentName, size)}`;
}

export function getSizeClass(componentName: string, size: string = ''): string {
	return `${componentName}-${getSizeClassSuffix(size)}`;
}

export function getSizeClassSuffix(size: string = ''): string {
	switch (size) {
		case 'xs':
			return `xs`;
		case 'sm':
			return `sm`;
		case 'lg':
			return `lg`;
		case 'xl':
			return `xl`;
		default:
			return 'md';
	}
}

export function getSmallerSizeClassSuffix(baseSize: string = ''): string {
	switch (baseSize) {
		case 'xs':
			return `xs`;
		case 'sm':
			return `xs`;
		case 'lg':
			return `md`;
		case 'xl':
			return `lg`;
		default:
			return 'sm';
	}
}

export async function handleAction(
	componentName: string,
	actionProps: LinkActionProps | ApiActionProps,
	params?: Record<string, any>,
	body?: any
): Promise<void> {
	if (params) {
		if (actionProps.linkUrl.includes('{') && actionProps.linkUrl.includes('}')) {
			actionProps.linkUrl = actionProps.linkUrl.replace(
				/{(.*?)}/g,
				(_, key) => params[key.trim()] || ''
			);
		}
		if (
			'apiUrl' in actionProps &&
			actionProps.apiUrl.includes('{') &&
			actionProps.apiUrl.includes('}')
		) {
			actionProps.apiUrl = actionProps.apiUrl.replace(
				/{(.*?)}/g,
				(_, key) => params[key.trim()] || ''
			);
		}
	}
	logger.info('Action clicked', {
		component: componentName,
		action: 'click',
		metadata: {
			label: actionProps.label,
			linkUrl: actionProps.linkUrl,
			apiUrl: (actionProps as ApiActionProps).apiUrl || ''
		}
	});
	if (actionProps as ApiActionProps) {
		let apiActionProps = actionProps as ApiActionProps;
		try {
			await apiClient.sendRequest(apiActionProps.apiUrl, {
				method: apiActionProps.method || 'POST',
				body: body
			});
		} catch (error) {
			ErrorHandler.handle(error, {
				component: componentName,
				action: 'click',
				metadata: {
					label: apiActionProps.label,
					linkUrl: apiActionProps.linkUrl,
					apiUrl: apiActionProps.apiUrl
				}
			});
		}
	}
	if (actionProps.target === '_self') {
		window.location.href = actionProps.linkUrl;
	} else {
		window.open(actionProps.linkUrl, '_blank');
	}
}

export function getIconClass(type: string): string {
	switch (type.toLowerCase()) {
		case 'create':
			return 'icon-[tabler--plus]';
		case 'edit':
			return 'icon-[tabler--pencil]';
		case 'delete':
			return 'icon-[tabler--trash]';
		case 'view':
			return 'icon-[tabler--eye]';
		case 'download':
			return 'icon-[tabler--download]';
		default:
			return 'icon-[tabler--antenna-bars-1]';
	}
}