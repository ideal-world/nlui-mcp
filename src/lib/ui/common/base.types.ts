export interface BaseComponentProps {
	title?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	noDataPrompt?: string;
}

export interface BaseActionProps {
	label?: string;
}

export interface LinkActionProps extends BaseActionProps {
	/** Supports using {} as placeholders */
	linkUrl: string;
	target?: '_self' | '_blank';
	type?: 'create' | 'edit' | 'view' | 'delete' | 'download';
}

export interface ApiActionProps extends LinkActionProps {
	/** Supports using {} as placeholders */
	apiUrl: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}
