<script lang="ts">
  import type { NLUIChartComponentProps, ApexChartConfig } from './chart.types';
  import * as m from '../../../paraglide/messages';
  import { mergeDeep } from '$lib/utils';
  import { browser } from '$app/environment';

  let chartProps: NLUIChartComponentProps = $props();

  let chartContainer = $state<HTMLDivElement | undefined>();
  let chartInstance: any = null;
  let ApexCharts: any = null;
  let isLoading = $state(true);
  let isInitialized = $state(false);

  function cleanup() {
    if (chartInstance) {
      try {
        chartInstance.destroy();
        chartInstance = null;
      } catch (error) {
        console.error('Error destroying chart:', error);
      }
    }
  }

  $effect(() => {
    return () => {
      cleanup();
    };
  });

  let mergedConfig: ApexChartConfig = $derived.by(() => {
    const defaultConfig: ApexChartConfig = {
      chart: {
        type: 'line'
      }
    };
    return mergeDeep(defaultConfig, chartProps.config);
  });

  $effect(() => {
    if (!browser || isInitialized) return;

    (async () => {
      try {
        ApexCharts = (await import('apexcharts')).default;
        isLoading = false;
        isInitialized = true;
      } catch (error) {
        console.error('Failed to load ApexCharts:', error);
        isLoading = false;
      }
    })();
  });

  $effect(() => {
    if (chartContainer && ApexCharts && !isLoading && hasData && !chartInstance) {
      renderChart();
    }
  });

  async function renderChart() {
    if (!ApexCharts || !chartContainer || !chartProps.config || !chartProps.series?.length || chartInstance) {
      return;
    }

    try {
      const config = mergedConfig;
      const finalConfig = {
        ...config,
        chart: {
          ...config.chart,
        },
        series: chartProps.series
      };

      chartInstance = new ApexCharts(chartContainer, finalConfig);
      await chartInstance.render();
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }

  let hasData = $derived(
    chartProps.series &&
      chartProps.series.length > 0 &&
      chartProps.series.some((series) => {
        if (typeof series === 'number') {
          return !isNaN(series);
        }
        return series.data && series.data.length > 0;
      })
  );

  let showNoData = $derived(!hasData);
  let noDataMessage = $derived(chartProps.noDataPrompt || m.chart_no_data?.() || 'No data available');
</script>

<div class="card bg-base-100 border-base-300 w-full border shadow-sm">
  {#if chartProps.title}
    <div class="card-body pb-0">
      <div class="card-title text-base-content">
        <h3 class="text-lg font-semibold">{chartProps.title}</h3>
      </div>
    </div>
  {/if}

  <div class="card-body {chartProps.title ? 'pt-4' : ''}">
    <div class='w-full'>
      {#if isLoading}
        <div class="text-base-content/60 flex h-[350px] flex-col items-center justify-center">
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="mt-2 text-sm">Loading chart...</p>
        </div>
      {:else if showNoData}
        <div class="text-base-content/60 flex h-[350px] flex-col items-center justify-center">
          <div class="icon-[tabler--chart-line] text-base-content/30 mb-2 h-12 w-12"></div>
          <p class="text-sm">{noDataMessage}</p>
        </div>
      {:else}
        <div bind:this={chartContainer} class="w-full"></div>
      {/if}
    </div>
  </div>
</div>
