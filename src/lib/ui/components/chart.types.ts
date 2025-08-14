import type { BaseComponentProps } from '../common/base.types';

export interface NLUIChartComponentProps extends BaseComponentProps {
  /** Chart configuration options compatible with ApexCharts */
  config: ApexChartConfig;
  /** Chart data series */
  series: ApexChartSeries[] | number[];
}

export interface ApexChartConfig {
  /** Chart type and basic settings */
  chart: {
    type: 'line' | 'area' | 'bar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'candlestick';
  };
  /** X-axis configuration */
  xaxis?: {
    type?: 'datetime' | 'numeric' | 'category';
    categories?: any[];
  };
  /** Chart labels for pie, donut, radialBar charts */
  labels?: string[];
}

export interface ApexChartSeries {
  /** Series name */
  name: string;
  /** Series data */
  data: any[];
}
