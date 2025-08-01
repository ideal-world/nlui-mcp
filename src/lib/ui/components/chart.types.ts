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

//     };
//   };

//   /** Chart plotOptions for specific chart types */
//   plotOptions?: {
//     area?: {
//       fillTo?: 'origin' | 'end';
//     };
//     bar?: {
//       horizontal?: boolean;
//       columnWidth?: string;
//       barHeight?: string;
//       distributed?: boolean;
//       borderRadius?: number;
//       rangeBarOverlap?: boolean;
//       rangeBarGroupRows?: boolean;
//       dataLabels?: {
//         maxItems?: number;
//         hideOverflowingLabels?: boolean;
//         position?: 'top' | 'center' | 'bottom';
//       };
//     };
//     pie?: {
//       size?: number;
//       customScale?: number;
//       offsetX?: number;
//       offsetY?: number;
//       startAngle?: number;
//       endAngle?: number;
//       expandOnClick?: boolean;
//       dataLabels?: {
//         offset?: number;
//         minAngleToShowLabel?: number;
//       };
//       donut?: {
//         size?: string;
//         background?: string;
//         labels?: {
//           show?: boolean;
//           name?: {
//             show?: boolean;
//             fontSize?: string;
//             fontFamily?: string;
//             fontWeight?: string | number;
//             color?: string;
//             offsetY?: number;
//             formatter?: (val: string) => string;
//           };
//           value?: {
//             show?: boolean;
//             fontSize?: string;
//             fontFamily?: string;
//             fontWeight?: string | number;
//             color?: string;
//             offsetY?: number;
//             formatter?: (val: string) => string;
//           };
//           total?: {
//             show?: boolean;
//             showAlways?: boolean;
//             label?: string;
//             fontSize?: string;
//             fontFamily?: string;
//             fontWeight?: string | number;
//             color?: string;
//             formatter?: (w: any) => string;
//           };
//         };
//       };
//     };
//     radialBar?: {
//       inverseOrder?: boolean;
//       startAngle?: number;
//       endAngle?: number;
//       offsetX?: number;
//       offsetY?: number;
//       hollow?: {
//         margin?: number;
//         size?: string;
//         background?: string;
//         image?: string;
//         imageWidth?: number;
//         imageHeight?: number;
//         imageOffsetX?: number;
//         imageOffsetY?: number;
//         imageClipped?: boolean;
//         position?: 'front' | 'back';
//       };
//       track?: {
//         show?: boolean;
//         startAngle?: number;
//         endAngle?: number;
//         background?: string;
//         strokeWidth?: string;
//         opacity?: number;
//         margin?: number;
//         dropShadow?: {
//           enabled?: boolean;
//           top?: number;
//           left?: number;
//           blur?: number;
//           color?: string;
//           opacity?: number;
//         };
//       };
//       dataLabels?: {
//         show?: boolean;
//         name?: {
//           show?: boolean;
//           fontSize?: string;
//           fontFamily?: string;
//           fontWeight?: string | number;
//           color?: string;
//           offsetY?: number;
//         };
//         value?: {
//           show?: boolean;
//           fontSize?: string;
//           fontFamily?: string;
//           fontWeight?: string | number;
//           color?: string;
//           offsetY?: number;
//           formatter?: (val: number) => string;
//         };
//         total?: {
//           show?: boolean;
//           label?: string;
//           fontSize?: string;
//           fontFamily?: string;
//           fontWeight?: string | number;
//           color?: string;
//           formatter?: (opts: any) => string;
//         };
//       };
//     };
//     radar?: {
//       size?: number;
//       offsetX?: number;
//       offsetY?: number;
//       polygons?: {
//         strokeColors?: string | string[];
//         strokeWidth?: string | number;
//         connectorColors?: string | string[];
//         fill?: {
//           colors?: string[];
//         };
//       };
//     };
//     heatmap?: {
//       radius?: number;
//       enableShades?: boolean;
//       shadeIntensity?: number;
//       reverseNegativeShade?: boolean;
//       distributed?: boolean;
//       useFillColorAsStroke?: boolean;
//       colorScale?: {
//         ranges?: Array<{
//           from?: number;
//           to?: number;
//           color?: string;
//           foreColor?: string;
//           name?: string;
//         }>;
//         inverse?: boolean;
//         min?: number;
//         max?: number;
//       };
//     };
//     treemap?: {
//       enableShades?: boolean;
//       shadeIntensity?: number;
//       distributed?: boolean;
//       reverseNegativeShade?: boolean;
//       useFillColorAsStroke?: boolean;
//       colorScale?: {
//         ranges?: Array<{
//           from?: number;
//           to?: number;
//           color?: string;
//           foreColor?: string;
//           name?: string;
//         }>;
//         inverse?: boolean;
//         min?: number;
//         max?: number;
//       };
//     };
//     bubble?: {
//       minBubbleRadius?: number;
//       maxBubbleRadius?: number;
//     };
//     scatter?: {
//       size?: number;
//     };
//     candlestick?: {
//       colors?: {
//         upward?: string;
//         downward?: string;
//       };
//       wick?: {
//         useFillColor?: boolean;
//       };
//     };
//     boxPlot?: {
//       colors?: {
//         upper?: string;
//         lower?: string;
//       };
//     };
//   };


}

export interface ApexChartSeries {
  /** Series name */
  name: string;
  /** Series data */
  data: any[];
}
