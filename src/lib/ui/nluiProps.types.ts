import type { BaseComponentProps } from './common/base.types';
import type { NLUIAlertComponentProps } from './components/alert.types';
import type { NLUICardComponentProps } from './components/card.types';
import type { NLUIFormComponentProps } from './components/form.types';
import type { NLUIListComponentProps } from './components/list.types';
import type { NLUITableComponentProps } from './components/table.types';

export interface NLUIProps {
	/** Layout structure with header, footer, sidebars, and main content */
	block: NLUIBlock;
	/** Show built-in toolbar (theme, language switcher) */
	showTools?: boolean;
	/** Show raw NLUIProp data for debugging */
	showDebug?: boolean;
}

/**
 * 5-area layout: header, footer, left/right sidebars, main content
 */
export interface NLUIBlock {
	/** Required core content area */
	main: NLUIComponent | NLUIBlock;
	/** Top navigation/title area */
	header?: NLUIComponent | NLUIBlock;
	/** Bottom copyright/contact area */
	footer?: NLUIComponent | NLUIBlock;
	/** Left navigation/filter sidebar */
	left?: NLUIComponent | NLUIBlock;
	/** Right ads/related content sidebar */
	right?: NLUIComponent | NLUIBlock;
}

export type NLUIComponentKind =
	| 'card'
	| 'alert'
	| 'image'
	| 'video'
	| 'audio'
	| 'code'
	| 'table'
	| 'list'
	| 'chart'
	| 'calendar'
	| 'timeline'
	| 'kanban'
	| 'gantt'
	| 'gallery'
	| 'map'
	| 'form'
	| 'diagram'
	| 'mindmap';

export interface NLUIComponent extends BaseComponentProps {
	/** Component type determines which UI element to render */
	kind: NLUIComponentKind;
	/** @conditional kind === "card" */
	cardProps?: NLUICardComponentProps;
	/** @conditional kind === "table" */
	tableProps?: NLUITableComponentProps;
	/** @conditional kind === "form" */
	formProps?: NLUIFormComponentProps;
	/** @conditional kind === "list" */
	listProps?: NLUIListComponentProps;
	/** @conditional kind === "alert" */
	alertProps?: NLUIAlertComponentProps;
}
