import { logger } from '$lib/utils/logger';
import type { ApiActionProps, LinkActionProps } from './base.types';
import { apiClient } from '$lib/utils/apiClient';
import { ErrorHandler } from '$lib/utils/errorHandler';

export function getBaseClasses(componentName: string, size: string = ''): string {
	return `${componentName} ${getSizeClass(componentName, size)}`;
}

export function getSizeClass(componentName: string, size: string = ''): string {
	switch (size) {
		case 'xs':
			return `${componentName}-xs`;
		case 'sm':
			return `${componentName}-sm`;
		case 'lg':
			return `${componentName}-lg`;
		case 'xl':
			return `${componentName}-xl`;
		default:
			return '';
	}
}

export async function handleAction(
	componentName: string,
	actionProps: LinkActionProps | ApiActionProps,
	body?: any
): Promise<void> {
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
