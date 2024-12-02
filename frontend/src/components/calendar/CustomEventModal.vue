<template>
  <div class="custom-event-modal">
    <div class="event-title-container">
      <p class="event-title">{{ title }}</p>
      <div class="event-controls">
        <Button id="delete-button" icon="pi pi-trash" @click="deleteEvent(calendarEvent)" variant="text" />
        <Button id="edit-button" icon="pi pi-pencil" @click="showForm(calendarEvent)" variant="text" />
      </div>
    </div>
    <div class="event-subtitle-container">
      <p>
        <i class="pi pi-map-marker" style="font-size: 0.75rem"></i>
        {{ location }}
      </p>
      <p>
        <i class="pi pi-clock" style="font-size: 0.75rem"></i>
        {{ `${start} - ${end}` }}
      </p>
    </div>
    <p class="event-description">{{ description }}</p>
    <Button id="join-button" v-if="calendarEvent.type == 'meeting'" label="Join meeting" fluid variant="raised"
      @click="joinMeeting" />

    <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
      <EventForm :id="calendarEvent.id" :initialValues="initialValues" @close="onEventClose" />
    </Dialog>

    <Dialog v-model:visible="meetingVisible" modal header="Create Meeting" :style="{ width: '50vw' }">
      <MeetingForm :initialValues="initialValues" @close="meetingVisible = false" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { useEventsStore } from "../../stores/events.store.ts";
import { client } from "../../api/index.ts";
import { useRouter } from "vue-router";
import { useCalendarStore } from "../../stores/calendar.store.ts";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import EventForm from "../forms/EventForm.vue";
import MeetingForm from "../forms/MeetingForm.vue";

import moment from "moment-timezone";

const router = useRouter();

const eventsStore = useEventsStore();
const calendarStore = useCalendarStore();

const props = defineProps({
  calendarEvent: {
    type: Object as PropType<{
      title: string;
      id: number | string;
      description: string;
      location: string;
      start: string;
      end: string;
      type: "event" | "meeting";
      rrule: string;
    }>,
    required: true,
  },
});

const title = ref(props.calendarEvent.title);
const location = ref(props.calendarEvent.location);
const description = ref(props.calendarEvent.description);
const start = ref(props.calendarEvent.start);
const end = ref(props.calendarEvent.end);

const eventVisible = ref(false);
const meetingVisible = ref(false);

const initialValues = ref();
if (props.calendarEvent.type == "event") {
  client.events.getEvent
    .query({ eventId: props.calendarEvent.id })
    .then((res) => {
      initialValues.value = Object.assign({},
        res.event.name && { name: res.event.name },
        res.event.location && { location: res.event.location },
        res.event.description && { description: res.event.description },
        res.event.project_id && { project_id: res.event.project_id },
        res.event.start_time && { start_time: moment.utc(res.event.start_time).local().toDate() },
        res.event.end_time && { end_time: moment.utc(res.event.end_time).local().toDate() },
        res.event.rrule && { repeat: true },
        res.event.project_id && { project_id: res.event.project_id },
        res.event.rrule &&
        res.event.rrule.match(/FREQ=([^;]+)/)?.[1] && {
          frequency: res.event.rrule.match(/FREQ=([^;]+)/)?.[1],
        },
        res.event.rrule &&
        res.event.rrule.match(/INTERVAL=([^;]+)/)?.[1] && {
          interval: parseInt(res.event.rrule.match(/INTERVAL=([^;]+)/)?.[1]),
        },
        res.event.rrule &&
        res.event.rrule.match(/BYDAY=([^;]+)/)?.[1] && {
          byday: res.event.rrule.match(/BYDAY=([^;]+)/)?.[1].split(","),
        },
        res.event.rrule &&
        res.event.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
          bymonthday: res.event.rrule
            .match(/BYMONTHDAY=([^;]+)/)?.[1]
            .split(",")
            .map((monthday) => parseInt(monthday)),
        },
        res.event.rrule &&
        res.event.rrule.match(/UNTIL=([^;]+)/)?.[1] && {
          until: moment(res.eventrrule.match(/UNTIL=([^;]+)/)?.[1]).toDate(),
        },
      );
    })
    .catch((err) => console.log(err));
} else if (props.calendarEvent.type == "meeting") {
  client.meetings.getMeeting
    .query({ meetingId: props.calendarEvent.id })
    .then((res) => {
      initialValues.value = Object.assign({},
        res.meeting.name && { name: res.meeting.name },
        res.meeting.location && { location: res.meeting.location },
        res.meeting.participants && { participants: res.meeting.participants },
        res.meeting.project_id && { project_id: res.meeting.project_id },
        res.meeting.description && { description: res.meeting.description },
        res.meeting.start_time && { start_time: moment.utc(res.meeting.start_time).local().toDate() },
        res.meeting.end_time && { end_time: moment.utc(res.meeting.end_time).local().toDate() },
        res.meeting.rrule && { repeat: true },
        res.meeting.project_id && { project_id: res.meeting.project_id },
        res.meeting.rrule &&
        res.meeting.rrule.match(/FREQ=([^;]+)/)?.[1] && {
          frequency: res.meeting.rrule.match(/FREQ=([^;]+)/)?.[1],
        },
        res.meeting.rrule &&
        res.meeting.rrule.match(/INTERVAL=([^;]+)/)?.[1] && {
          interval: parseInt(res.meeting.rrule.match(/INTERVAL=([^;]+)/)?.[1]),
        },
        res.meeting.rrule &&
        res.meeting.rrule.match(/BYDAY=([^;]+)/)?.[1] && {
          byday: res.meeting.rrule.match(/BYDAY=([^;]+)/)?.[1].split(","),
        },
        res.meeting.rrule &&
        res.meeting.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
          bymonthday: res.meeting.rrule
            .match(/BYMONTHDAY=([^;]+)/)?.[1]
            .split(",")
            .map((monthday) => parseInt(monthday)),
        },
        res.meeting.rrule &&
        res.meeting.rrule.match(/UNTIL=([^;]+)/)?.[1] && {
          until: moment(res.meeting.rrule.match(/UNTIL=([^;]+)/)?.[1]).toDate(),
        },
      );
    })
    .catch((err) => console.log(err));
} else {
  console.log("Unrecognized event type.");
}

function showForm(calendarEvent) {
  console.log(calendarEvent);
  if (calendarEvent.type == "meeting") {
    meetingVisible.value = true;
    eventVisible.value = false;
  } else if (calendarEvent.type == "event") {
    meetingVisible.value = false;
    eventVisible.value = true;
  } else {
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

  if (calendarEvent.type == "meeting") {
    client.meetings.deleteMeeting
      .mutate({ meetingId: calendarEvent.id })
      .then((res) => {
        console.log(res);
        calendarStore.removeEvent(calendarEvent.id);
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (calendarEvent.type == "event") {
    client.events.deleteEvent
      .mutate({ eventId: calendarEvent.id })
      .then((res) => {
        console.log(res);
        calendarStore.removeEvent(calendarEvent.id);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.warn("Unrecognized type");
  }
}

function onEventClose(newEvent) {
  eventVisible.value = false;
  title.value = newEvent.name;
  location.value = newEvent.location;
  description.value = newEvent.description;
  start.value = moment
    .utc(newEvent.start)
    .local()
    .format("YYYY-MM-DD HH:mm");
  end.value = moment
    .utc(newEvent.end)
    .local()
    .format("YYYY-MM-DD HH:mm");
}
</script>

<style lang="css" scoped>
.custom-event-modal {
  padding: var(--sx-spacing-padding6);
  background-color: var(--sx-color-background);
  box-shadow:
    0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12),
    0 11px 15px -7px rgba(0, 0, 0, 0.2);
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
