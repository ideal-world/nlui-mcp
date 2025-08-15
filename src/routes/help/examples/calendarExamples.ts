import type { NLUICalendarComponentProps } from '$lib/ui/components/calendar.types';

export function getCalendarExamples(): NLUICalendarComponentProps[] {
  return [
    {
      title: 'Team Schedule',
      events: [
        {
          id: '1',
          title: 'Sprint Planning',
          start: '2024-08-20T09:00:00',
          end: '2024-08-20T11:00:00',
          kind: 'info'
        },
        {
          id: '2',
          title: 'Design Review',
          start: '2024-08-22T14:00:00',
          end: '2024-08-22T15:30:00',
          kind: 'error'
        },
        {
          id: '3',
          title: 'Client Meeting',
          start: '2024-08-25T10:00:00',
          end: '2024-08-25T11:00:00',
          kind: 'success'
        },
        {
          id: '4',
          title: 'Weekly Standup',
          start: '2024-08-26T09:30:00',
          end: '2024-08-26T10:00:00',
          kind: 'warning'
        },
        {
          id: '5',
          title: 'Product Demo',
          start: '2024-08-28T15:00:00',
          end: '2024-08-28T16:00:00',
          kind: 'info'
        }
      ]
    },
    {
      title: 'Personal Calendar',
      events: [
        {
          id: '1',
          title: 'Morning Workout',
          start: '2024-08-21T07:00:00',
          end: '2024-08-21T08:00:00',
          kind: 'success'
        },
        {
          id: '2',
          title: 'Lunch with Sarah',
          start: '2024-08-23T12:00:00',
          end: '2024-08-23T13:30:00',
          kind: 'info'
        },
        {
          id: '3',
          title: 'Doctor Appointment',
          start: '2024-08-27T16:00:00',
          end: '2024-08-27T17:00:00',
          kind: 'warning'
        }
      ]
    }
  ];
}
