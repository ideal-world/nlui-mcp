import type { NLUITimelineComponentProps } from '$lib/ui/components/timeline.types';

export function getTimelineExamples(): NLUITimelineComponentProps[] {
  return [
    {
      title: 'Project Timeline',
      items: [
        {
          id: '1',
          title: 'Planning',
          description: 'Requirements gathering',
          time: '2024-01-15',
          status: 'success'
        },
        {
          id: '2',
          title: 'Development',
          description: 'Core features',
          time: '2024-02-20',
          status: 'warning'
        },
        {
          id: '3',
          title: 'Testing',
          description: 'QA and fixes',
          time: '2024-03-10'
        }
      ]
    },
    {
      title: 'Company Milestones',
      items: [
        {
          id: '1',
          title: 'Company Founded',
          description: 'Started the company with a small team of passionate developers.',
          time: '2020-01-01',
          status: 'success'
        },
        {
          id: '2',
          title: 'First Product Launch',
          description: 'Successfully launched our first SaaS product to the market.',
          time: '2020-06-15',
          status: 'success'
        },
        {
          id: '3',
          title: 'Series A Funding',
          description: 'Raised $5M in Series A funding to accelerate growth.',
          time: '2021-03-20',
          status: 'success'
        },
        {
          id: '4',
          title: '100K Users Milestone',
          description: 'Reached 100,000 active users across all platforms.',
          time: '2022-09-10',
          status: 'success'
        }
      ]
    }
  ];
}
