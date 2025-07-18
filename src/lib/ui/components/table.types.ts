import type { BaseComponentProps } from '../common/base.types';

export interface NLUITableAction {
	label: string;
	/** Click navigation URL */
	onClickLink?: string;
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface NLUITableColumn {
	/** Data field key */
	key: string;
	title: string;
	width?: string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
}

export interface NLUITableRow {
	id: string | number;
	/** Row cell data mapped by column keys */
	data: Record<string, any>;
	actions?: NLUITableAction[];
}

export interface NLUITableComponentProps extends BaseComponentProps {
	columns: NLUITableColumn[];
	rows: NLUITableRow[];
	caption?: string;
	footer?: string;
	striped?: boolean;
}
