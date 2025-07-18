import type { BaseComponentProps } from '../common/base.types';

export interface NLUICardComponentProps extends BaseComponentProps {
	title?: string;
	/** Supports HTML markup */
	body: string;
	/** Additional info (time, source, etc.) */
	footer?: string;
	image?: string;
	/** true: horizontal (image left), false: vertical (image top) */
	horizontal?: boolean;
	primaryAction?: {
		label: string;
		onClickLink?: string;
	};
	secondaryAction?: {
		label: string;
		onClickLink?: string;
	};
}
