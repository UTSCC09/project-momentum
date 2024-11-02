<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

// plugins
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import CustomEventModal from './CustomEventModal.vue'
import UserMenu from './UserMenu.vue'
import CalendarDrawerButton from './CalendarDrawerButton.vue'

const config = {
  // isDark: true,
  // selectedDate: '2023-12-19',
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: [
  {
    "id": 1,
    "title": "Team Meeting",
    "description": "Monthly team meeting to discuss project updates and goals.",
    "location": "Conference Room A",
    "start": "2024-11-10 10:00",
    "end": "2024-11-10 11:00"
  },
  {
    "id": 2,
    "title": "Doctor Appointment",
    "description": "Routine check-up with Dr. Smith.",
    "location": "Health Clinic, 123 Main St.",
    "start": "2024-11-11 14:30",
    "end": "2024-11-11 15:00"
  },
  {
    "id": 3,
    "title": "Project Kickoff",
    "description": "Kickoff meeting for the new project with stakeholders.",
    "location": "Zoom",
    "start": "2024-11-12 09:00",
    "end": "2024-11-12 10:00"
  },
  {
    "id": 4,
    "title": "Workshop: Effective Communication",
    "description": "A workshop on improving communication skills.",
    "location": "Training Room B",
    "start": "2024-11-15 13:00",
    "end": "2024-11-15 15:00"
  },
  {
    "id": 5,
    "title": "Birthday Party",
    "description": "Celebrating Sarah's birthday with friends and family.",
    "location": "Home",
    "start": "2024-11-20 17:00",
    "end": "2024-11-20 21:00"
  },
  {
    "id": 6,
    "title": "Yoga Class",
    "description": "Evening yoga session to unwind and relax.",
    "location": "Yoga Studio, 456 Elm St.",
    "start": "2024-11-21 18:00",
    "end": "2024-11-21 19:00"
  },
  {
    "id": 7,
    "title": "Sales Presentation",
    "description": "Presentation of the Q4 sales strategy to the board.",
    "location": "Main Hall",
    "start": "2024-11-22 11:00",
    "end": "2024-11-22 12:30"
  },
  {
    "id": 8,
    "title": "Charity Run",
    "description": "Participating in a charity run to support local shelters.",
    "location": "City Park",
    "start": "2024-11-25 08:00",
    "end": "2024-11-25 10:00"
  }
],
};

const plugins = [
  createDragAndDropPlugin(), createResizePlugin(), createEventModalPlugin(),
  createCurrentTimePlugin(), createEventsServicePlugin(),
];

const customComponents = {
  eventModal: CustomEventModal,
  headerContentRightAppend: UserMenu,
  headerContentLeftPrepend: CalendarDrawerButton
}

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar(config, plugins)
</script>

<template>
  <div>
    <ScheduleXCalendar :calendar-app="calendarApp" :custom-components="customComponents" />
  </div>
</template>
