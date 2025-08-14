<script lang="ts">
  import { browser } from '$app/environment';
  import { mergeDeep } from '$lib/utils';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import listPlugin from '@fullcalendar/list';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import { handleAction } from '../common/base.utils';
  import type { CalendarConfig, NLUICalendarComponentProps } from './calendar.types';

  let calendarProps: NLUICalendarComponentProps = $props();

  let calendarContainer = $state<HTMLDivElement | undefined>();
  let calendarInstance: any = null;
  let isInitialized = $state(false);

  function cleanup() {
    if (calendarInstance) {
      try {
        calendarInstance.destroy();
        calendarInstance = null;
      } catch (error) {
        console.error('Error destroying calendar:', error);
      }
    }
  }

  $effect(() => {
    return () => {
      cleanup();
    };
  });

  let mergedConfig: CalendarConfig = $derived.by(() => {
    const defaultConfig: CalendarConfig = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false
    };
    return mergeDeep(defaultConfig, calendarProps.config || {});
  });

  $effect(() => {
    if (!browser || isInitialized) return;
    const events =
      calendarProps.events.map((event) => ({
        ...event,
        classNames: event.kind ? ['fc-event-' + event.kind] : []
      })) || [];
    try {
      calendarInstance = new Calendar(calendarContainer!, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        ...mergedConfig,
        events,
        eventClick: (args) => {
          const action = calendarProps.action;
          if (action) {
            handleAction('calendar', action, args.event);
          }
        }
      });
      calendarInstance.render();
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing calendar:', error);
    }
  });
</script>

<div>
  {#if calendarProps.title}
    <div class="mb-4">
      <h2 class="text-base-content text-2xl font-bold">{calendarProps.title}</h2>
    </div>
  {/if}

  <div class="calendar-wrapper">
    <div bind:this={calendarContainer} class="bg-base-100 w-full rounded-lg p-4"></div>
  </div>
</div>
