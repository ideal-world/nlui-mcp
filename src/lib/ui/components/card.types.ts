import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUICardComponentProps extends BaseComponentProps {
	/** Supports HTML markup */
	body?: string;
	/** Additional info (time, source, etc.) */
	footer?: string;
	image?: string;
	primaryAction?: LinkActionProps;
	secondaryAction?: LinkActionProps;
}
