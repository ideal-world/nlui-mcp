import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUITableColumn {
	/** Data field key */
	key: string;
	title: string;
	tagStyle?: boolean;
}

export interface NLUITableRow {
	id: string | number;
	/** Row cell data mapped by column keys */
	data: Record<string, any>;
}

export interface NLUITableComponentProps extends BaseComponentProps {
	columns: NLUITableColumn[];
	rows: NLUITableRow[];
	actions?: LinkActionProps[] | ApiActionProps[];
	pageSize?: number;
	searchable?: boolean;
}
