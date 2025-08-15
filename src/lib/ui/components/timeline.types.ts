import type { BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUITimelineComponentProps extends BaseComponentProps {
  /** Timeline items to render in order */
  items: TimelineItem[];
  /** Direction layout; currently only vertical is styled */
  direction?: 'vertical' | 'horizontal';
  /** Optional action triggered on click */
  action?: LinkActionProps;
}

export interface TimelineItem {
  id?: string | number;
  title: string;
  description?: string;
  time?: string;
  /** Status color for marker and accents */
  status?: 'success' | 'warning' | 'error';
}
