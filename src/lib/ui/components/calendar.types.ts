import type { BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUICalendarComponentProps extends BaseComponentProps {
  /** Calendar view configuration */
  config?: CalendarConfig;
  /** Calendar events data */
  events: CalendarEvent[];
  /** Click event link */
  action?: LinkActionProps;
}

export interface CalendarConfig {
  /** Initial view type */
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  /** Whether the calendar header is visible */
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  /** Whether events are editable */
  editable?: boolean;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end?: string;
  /** Whether the event spans all day */
  allDay?: boolean;
  /** Event kind */
  kind?: 'info' | 'success' | 'warning' | 'error';
}
