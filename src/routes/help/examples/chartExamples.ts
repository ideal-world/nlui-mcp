import type { NLUIChartComponentProps } from '$lib/ui/components/chart.types';
import * as m from '../../../paraglide/messages';

/**
 * 图表示例数据生成器
 * Chart examples data generator
 */
export function getChartExamples(): NLUIChartComponentProps[] {
  return [
    // 销售收入图表 / Sales Revenue Chart
    {
      title: m.example_chart_sales_title(),
      config: {
        chart: { type: 'line' },
        xaxis: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        }
      },
      series: [
        {
          name: m.chart_series_revenue(),
          data: [30, 40, 45, 50, 49, 60]
        }
      ]
    },

    // 市场份额分布 / Market Share Distribution
    {
      title: m.example_chart_market_title(),
      config: {
        chart: { type: 'pie' },
        labels: [m.chart_label_company_a(), m.chart_label_company_b(), m.chart_label_company_c(), m.chart_label_company_d(), m.chart_label_others()]
      },
      series: [44, 25, 15, 10, 6]
    },

    // 团队绩效图表 / Team Performance Chart
    {
      title: m.example_chart_performance_title(),
      config: {
        chart: { type: 'bar' },
        xaxis: {
          type: 'category',
          categories: ['Q1', 'Q2', 'Q3', 'Q4']
        }
      },
      series: [
        {
          name: m.chart_series_tasks(),
          data: [44, 55, 57, 56]
        }
      ]
    },

    // 用户增长趋势 / User Growth Trend
    {
      title: m.example_chart_growth_title(),
      config: {
        chart: { type: 'area' },
        xaxis: {
          type: 'category',
          categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        }
      },
      series: [
        {
          name: m.chart_series_users(),
          data: [31, 40, 28, 51]
        }
      ]
    },

    // 网站分析 / Website Analytics
    {
      title: m.example_chart_website_title(),
      config: {
        chart: { type: 'line' },
        xaxis: {
          type: 'category',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      },
      series: [
        {
          name: m.chart_series_pageviews(),
          data: [23, 11, 22, 27, 13, 22, 37]
        },
        {
          name: m.chart_series_sessions(),
          data: [30, 25, 36, 30, 45, 35, 64]
        }
      ]
    }
  ];
}
