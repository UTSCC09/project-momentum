<template>
  <div class="custom-event-modal">
    <div class="event-title-container">
      <p class="event-title">{{ calendarEvent.title }}</p>
      <div class="event-controls">
        <Button id="delete-button" icon="pi pi-trash" @click="deleteEvent(calendarEvent)" variant="text" />
        <Button id="edit-button" icon="pi pi-pencil" @click="showForm(calendarEvent)" variant="text" />
      </div>
    </div>
    <div class="event-subtitle-container">
      <p><i class="pi pi-map-marker" style="font-size: 0.75rem"></i> {{ calendarEvent.location }}</p>
      <p><i class="pi pi-clock" style="font-size: 0.75rem"></i> {{ `${calendarEvent.start} - ${calendarEvent.end}` }}
      </p>
    </div>
    <p class="event-description">{{ calendarEvent.description }}</p>
    <Button id="join-button" v-if="calendarEvent.type == 'meeting'" label="Join meeting" fluid variant="raised"
      @click="joinMeeting" />

    <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
      <EventForm :initialValues="initialValues" @close="eventVisible = false;" />
    </Dialog>

    <Dialog v-model:visible="meetingVisible" modal header="Create Meeting" :style="{ width: '50vw' }">
      <MeetingForm :initialValues="initialValues" @close="meetingVisible = false;" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { useEventsStore } from "../../stores/events.store.ts";
import { client } from '../../api/index.ts';
import { useRouter } from 'vue-router';
import { useCalendarStore } from '../../stores/calendar.store.ts';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import EventForm from '../forms/EventForm.vue';
import MeetingForm from '../forms/MeetingForm.vue';

import moment from 'moment-timezone';

const router = useRouter();

const eventsStore = useEventsStore();
const calendarStore = useCalendarStore();

const props = defineProps({
  calendarEvent: {
    type: Object as PropType<{
      title: string; id: number | string, description: string, location: string,
      start: string, end: string, type: "event" | "meeting", rrule: string
    }>,
    required: true,
  },
})

const eventVisible = ref(false);
const meetingVisible = ref(false);

const initialValues = ref();
if (props.calendarEvent.type == "event") {
  client.events.getEvent.query({ eventId: props.calendarEvent.id })
    .then((res) => {
      initialValues.value = {
        name: res.event.name,
        description: res.event.description,
        location: res.event.location,
        startTime: moment.utc(res.event.start_time).local().toDate(),
        endTime: moment.utc(res.event.end_time).local().toDate(),
        repeat: res.event.rrule ? true : false,
        project_id: res.event.project_id,
      }
      if (initialValues.value.repeat) {
        initialValues.value.frequency = res.event.rrule.match(/FREQ=([^;]+)/)?.[1] ?? null;
      }
    })
    .catch((err) => console.log(err))
}
else if (props.calendarEvent.type == "meeting") {
  client.meetings.getMeeting.query({ meetingId: props.calendarEvent.id })
    .then((res) => {
      initialValues.value = {
        name: res.meeting.name,
        description: res.meeting.description,
        location: res.meeting.location,
        startTime: moment.utc(res.meeting.start_time).local().toDate(),
        endTime: moment.utc(res.meeting.end_time).local().toDate(),
        repeat: res.meeting.rrule ? true : false,
        project_id: res.meeting.project_id,
      }
      if (initialValues.value.repeat) {
        initialValues.value.frequency = res.meeting.rrule.match(/FREQ=([^;]+)/)?.[1] ?? null;
      }
      console.log(initialValues);
    })
    .catch((err) => console.log(err))
}
else {
  console.log("Unrecognized event type.");
}

function showForm(calendarEvent) {
  console.log(calendarEvent);
  if (calendarEvent.type == "meeting") {
    meetingVisible.value = true;
    eventVisible.value = false;
  }
  else if (calendarEvent.type == "event") {
    meetingVisible.value = false;
    eventVisible.value = true;
  }
  else {
    console.log("Unrecognized event type.");
    meetingVisible.value = false;
    eventVisible.value = false;
  }
}

function joinMeeting() {
  router.push(`/meeting/${props.calendarEvent.id}`);
}

function deleteEvent(calendarEvent) {
  console.log(calendarEvent);

  if (calendarEvent.type == 'meeting') {
    client.meetings.deleteMeeting.mutate({ meetingId: calendarEvent.id })
      .then((res) => {
        console.log(res);
        calendarStore.removeEvent(calendarEvent.id);
      })
      .catch((err) => {
        console.error(err);
      })
  }
  else if (calendarEvent.type == 'event') {
    client.events.deleteEvent.mutate({ eventId: calendarEvent.id })
      .then((res) => {
        console.log(res);
        calendarStore.removeEvent(calendarEvent.id);
      })
      .catch((err) => {
        console.error(err);
      })
  }
  else {
    console.warn("Unrecognized type");
  }
}
</script>

<style lang="css" scoped>
.custom-event-modal {
  padding: var(--sx-spacing-padding6);
  background-color: var(--sx-color-background);
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  border-radius: var(--sx-rounding-small);
  max-height: 250px;
  overflow-y: scroll;
}

#title,
#location,
#description {
  width: 100%;
}

.p-dialog-content div {
  margin: 5px 0;
}

#datetime {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
}

#datetime span {
  flex-grow: 1;
}

.event-title-container {
  display: flex;
  justify-content: space-between;
  justify-items: center;
}

.event-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.event-controls {
  display: flex;
  justify-content: flex-end;
  justify-items: center;
}

.event-subtitle-container {
  font-size: 0.75rem;
}

#edit-button,
#delete-button {
  background: var(--p-button-text-primary-background);
  color: var(--p-button-text-primary-color);
  border: none;
}

#join-button {
  background: var(--p-button-primary-background);
  color: var(--p-button-primary-color);
}
</style>