<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

// plugins
import { useCalendarStore } from '../../stores/calendar.store.ts';

import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createEventRecurrencePlugin, createEventsServicePlugin } from "@schedule-x/event-recurrence";

import CustomEventModal from './CustomEventModal.vue'
import UserMenu from './UserMenu.vue'
import CalendarDrawerButton from './CalendarDrawerButton.vue'

import { client } from "../../api/index";
import { useAuthStore } from "../../stores/auth.store.ts";
import moment from 'moment-timezone';

const authStore = useAuthStore();

function getEvents(range) {
  const queryRange = {
    start_date: moment(range.start).local().utc().toISOString(),
    end_date: moment(range.end).local().utc().toISOString(),
  }

  client.meetings.getMeetingbyParticipant.query({ userId: authStore.user })
    .then((res) => {
      const meetingsAsParticipants = res.meetings
        .map((meeting) => {
          const calendarMeeting = {
            id: meeting.id,
            title: meeting.name,
            description: meeting.description,
            location: meeting.location,
            start: moment.utc(meeting.start_time).local().format("YYYY-MM-DD HH:mm"),
            end: moment.utc(meeting.end_time).local().format("YYYY-MM-DD HH:mm"),
            type: "meeting",
          };
          if (meeting.rrule) {
            calendarMeeting.rrule = meeting.rrule;
          }
          return calendarMeeting;
        });

      client.calendar.getCalendar.query(queryRange)
        .then((res) => {
          console.log(res.calendar);
          const events = res.calendar.events.map((event) => {
            const calendarEvent = {
              id: event.id,
              title: event.name,
              description: event.description,
              location: event.location,
              start: moment.utc(event.start_time).local().format("YYYY-MM-DD HH:mm"),
              end: moment.utc(event.end_time).local().format("YYYY-MM-DD HH:mm"),
              type: "event",
            };
            if (event.rrule) {
              calendarEvent.rrule = event.rrule;
            }
            return calendarEvent;
          });

          const meetings = res.calendar.meetings.map((meeting) => {
            const calendarMeeting = {
              id: meeting.id,
              title: meeting.name,
              description: meeting.description,
              location: meeting.location,
              start: moment.utc(meeting.start_time).local().format("YYYY-MM-DD HH:mm"),
              end: moment.utc(meeting.end_time).local().format("YYYY-MM-DD HH:mm"),
              type: "meeting",
            };
            if (meeting.rrule) {
              calendarMeeting.rrule = meeting.rrule;
            }
            return calendarMeeting;
          });
          
          calendarStore.setEvents(events.concat(meetings).concat(meetingsAsParticipants));
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })
}

const config = {
  // isDark: true,
  // selectedDate: '2023-12-19',
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  defaultView: createViewWeek().name,
  events: [
    {
      id: 123,
      title: 'Bi-Weekly Event Monday and Wednesday',
      start: '2024-02-05 14:00',
      end: '2024-02-05 15:00',
      rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;UNTIL=20240229T235959'
    },
    {
      id: 456,
      title: 'Weekly Event on 4 occasions',
      start: '2024-02-03',
      end: '2024-02-03',
      rrule: 'FREQ=WEEKLY;COUNT=4'
    },
    {
      id: 789,
      title: 'Daily event 5 times',
      start: '2024-02-05 12:00',
      end: '2024-02-05 13:55',
      rrule: 'FREQ=DAILY;COUNT=5',
      calendarId: 'personal',
    },
    {
      id: 121314,
      title: 'Daily event mo-fr 10 times',
      start: '2024-02-05 12:00',
      end: '2024-02-05 13:55',
      rrule: 'FREQ=DAILY;COUNT=10;BYDAY=MO,TU,WE,TH,FR',
      calendarId: 'work',
    },
    {
      id: 141617,
      title: 'Monthly event on the 7th 5 times',
      start: '2024-02-07 16:00',
      end: '2024-02-07 17:55',
      rrule: 'FREQ=MONTHLY;COUNT=5',
    },
    {
      rrule: 'FREQ=YEARLY;COUNT=5',
      title: 'Event on the 8th of February for 5 years',
      start: '2024-02-08 16:00',
      end: '2024-02-08 17:55',
      id: 181920
    }
  ],
  callbacks: {
    onRangeUpdate(range) {
      getEvents(range);
    },
    onEventUpdate(updatedEvent) {
      console.log(updatedEvent);
      if (updatedEvent.type == "event") {
        client.events.updateEvent.mutate({
          eventId: updatedEvent.id,
          start_time: moment(updatedEvent.start).local().utc().toISOString(),
          end_time: moment(updatedEvent.end).local().utc().toISOString(),
        })
          .then((res) => {
            console.log(res);
            calendarStore.updateEvent(updatedEvent);
          })
          .catch((err) => console.log(err));
      }
      if (updatedEvent.type == "meeting") {
        client.meetings.updateMeeting.mutate({
          meetingId: updatedEvent.id,
          start_time: moment(updatedEvent.start).local().utc().toISOString(),
          end_time: moment(updatedEvent.end).local().utc().toISOString(),
        })
          .then((res) => {
            console.log(res);
            calendarStore.updateEvent(updatedEvent);
          })
          .catch((err) => console.log(err));
      }
    }
  },
};

const calendarControls = createCalendarControlsPlugin();
const plugins = [
  createDragAndDropPlugin(), createResizePlugin(), createEventModalPlugin(),
  createCurrentTimePlugin(), createEventRecurrencePlugin(), createEventsServicePlugin(),
  calendarControls,
];

const customComponents = {
  eventModal: CustomEventModal,
  headerContentRightAppend: UserMenu,
  headerContentLeftPrepend: CalendarDrawerButton
};

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar(config, plugins);
const calendarStore = useCalendarStore();
calendarStore.setEventsService(calendarApp.eventsService);

getEvents(calendarControls.getRange());
</script>

<template>
  <div>
    <ScheduleXCalendar :calendar-app="calendarApp" :custom-components="customComponents" />
  </div>
</template>
