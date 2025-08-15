import type { BaseComponentProps } from './common/base.types';
import type { NLUIAudioComponentProps } from './components/audio.types';
import type { NLUICalendarComponentProps } from './components/calendar.types';
import type { NLUICardComponentProps } from './components/card.types';
import type { NLUIChartComponentProps } from './components/chart.types';
import type { NLUIFormComponentProps } from './components/form.types';
import type { NLUIImageComponentProps } from './components/image.types';
import type { NLUIMarkdownComponentProps } from './components/markdown.types';
import type { NLUITableComponentProps } from './components/table.types';
import type { NLUIVideoComponentProps } from './components/video.types';
import type { NLUITimelineComponentProps } from './components/timeline.types';

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

export type NLUIComponentKind = 'image' | 'video' | 'audio' | 'markdown' | 'table' | 'form' | 'card' | 'chart' | 'calendar' | 'timeline' | 'gallery' | 'mindmap';

export interface NLUIComponent extends BaseComponentProps {
  /** Component type determines which UI element to render */
  kind: NLUIComponentKind;
  /** @conditional kind === "card" */
  cardProps?: NLUICardComponentProps;
  /** @conditional kind === "table" */
  tableProps?: NLUITableComponentProps;
  /** @conditional kind === "form" */
  formProps?: NLUIFormComponentProps;
  /** @conditional kind === "image" */
  imageProps?: NLUIImageComponentProps;
  /** @conditional kind === "video" */
  videoProps?: NLUIVideoComponentProps;
  /** @conditional kind === "audio" */
  audioProps?: NLUIAudioComponentProps;
  /** @conditional kind === "markdown" */
  markdownProps?: NLUIMarkdownComponentProps;
  /** @conditional kind === "chart" */
  chartProps?: NLUIChartComponentProps;
  /** @conditional kind === "calendar" */
  calendarProps?: NLUICalendarComponentProps;
  /** @conditional kind === "timeline" */
  timelineProps?: NLUITimelineComponentProps;
}
