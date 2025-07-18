import type { BaseComponentProps } from '../common/base.types';

export interface NLUIAlertComponentProps extends BaseComponentProps {
	title?: string;
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	variant?: 'filled' | 'outlined' | 'soft' | 'ghost';
	closable?: boolean;
	/** Redirect URL when alert is closed */
	onCloseLink?: string;
	showIcon?: boolean;
}
