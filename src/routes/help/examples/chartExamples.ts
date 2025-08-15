import type { NLUIChartComponentProps } from '$lib/ui/components/chart.types';

export function getChartExamples(): NLUIChartComponentProps[] {
  return [
    {
      title: 'Monthly Sales Revenue',
      config: {
        chart: {
          type: 'line'
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      },
      series: [
        {
          name: 'Revenue',
          data: [45230, 52100, 48750, 61440, 58920, 67340, 72100, 68250, 71800, 75600, 78900, 82400]
        }
      ]
    },
    {
      title: 'Market Share Distribution',
      config: {
        chart: {
          type: 'pie'
        },
        labels: ['Company A', 'Company B', 'Company C', 'Company D', 'Others']
      },
      series: [35, 25, 20, 15, 5]
    },
    {
      title: 'Team Performance',
      config: {
        chart: {
          type: 'bar'
        },
        xaxis: {
          categories: ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace']
        }
      },
      series: [
        {
          name: 'Tasks Completed',
          data: [44, 55, 41, 37, 22, 43, 21]
        }
      ]
    }
  ];
}
