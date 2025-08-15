import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUITableComponentProps extends BaseComponentProps {
	columns: TableColumn[];
	rows: TableRow[];
	actions?: LinkActionProps[] | ApiActionProps[];
	pageSize?: number;
	searchable?: boolean;
}

export interface TableColumn {
	/** Data field key */
	key: string;
	title: string;
	tagStyle?: boolean;
}

export interface TableRow {
	id: string | number;
	/** Row cell data mapped by column keys */
	data: Record<string, any>;
}