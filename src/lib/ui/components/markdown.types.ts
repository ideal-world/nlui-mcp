import type { BaseComponentProps } from '../common/base.types';

export interface NLUIMarkdownComponentProps extends BaseComponentProps {
	/** Markdown content to render */
	content: string;
}