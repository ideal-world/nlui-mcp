import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUITableColumn {
	/** Data field key */
	key: string;
	title: string;
	tagStyle?: string;
}

export interface NLUITableRow {
	id: string | number;
	/** Row cell data mapped by column keys */
	data: Record<string, any>;
	actions?: LinkActionProps[] | ApiActionProps[];
}

export interface NLUITableComponentProps extends BaseComponentProps {
	columns: NLUITableColumn[];
	rows: NLUITableRow[];
	caption?: string;
	pageSize?: number;
	searchable?: boolean;
}
