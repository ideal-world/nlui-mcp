import type { BaseComponentProps } from '../common/base.types';

export interface NLUIListComponentProps extends BaseComponentProps {
	title?: string;
	items: NLUIListItem[];
	type?: 'basic' | 'card' | 'numbered' | 'bulleted';
	searchable?: boolean;
	searchPlaceholder?: string;
}

export interface NLUIListItem {
	id: string | number;
	/** Main display text */
	primary: string;
	/** Additional description text */
	secondary?: string;
	icon?: string;
	image?: string;
	/** Click navigation URL */
	link?: string;
	actions?: {
		label: string;
		link?: string;
		type?: 'primary' | 'secondary' | 'danger';
	}[];
}
