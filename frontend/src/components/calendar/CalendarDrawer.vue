<template>
  <div class="calendar-drawer-background">
    <Toast />

    <div class="calendar-drawer-container">
      <SplitButton
        label="Create"
        icon="pi pi-sparkles"
        :model="items"
        @click="toggle"
      />

      <Popover ref="op">
        <div class="nlp-container">
          <div class="nlp-instruction">How can I help you?</div>
          <div class="nlp-input-container">
            <InputText type="text" v-model="nlpInput" />
            <ProgressSpinner
              v-if="loading"
              style="width: 2rem; height: 2rem"
              strokeWidth="5"
            />
            <Button
              v-else
              icon="pi pi-send"
              severity="secondary"
              aria-label="Submit"
              @click="nlp"
            />
          </div>
        </div>
      </Popover>

      <div v-if="projects.length > 0" class="project-listbox">
        <Listbox
          v-model="selectedProjects"
          :options="projects"
          multiple
          optionLabel="name"
          @change="getProject"
        />
      </div>

      <Dialog
        v-model:visible="taskVisible"
        modal
        header="Create Task"
        :style="{ width: '50vw' }"
      >
        <TaskForm
          :initialValues="taskInitialValues"
          @close="taskVisible = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="eventVisible"
        modal
        header="Create Event"
        :style="{ width: '50vw' }"
      >
        <EventForm
          :initialValues="eventInitialValues"
          @close="eventVisible = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="meetingVisible"
        modal
        header="Create Meeting"
        :style="{ width: '50vw' }"
      >
        <MeetingForm
          :initialValues="meetingInitialValues"
          @close="meetingVisible = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="projectVisible"
        modal
        header="Create Project"
        :style="{ width: '50vw' }"
      >
        <ProjectForm @close="projectVisible = false" />
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitButton from "primevue/splitbutton";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Popover from "primevue/popover";
import InputText from "primevue/inputtext";
import Listbox from "primevue/listbox";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";

import TaskForm from "../forms/TaskForm.vue";
import EventForm from "../forms/EventForm.vue";
import MeetingForm from "../forms/MeetingForm.vue";
import ProjectForm from "../forms/ProjectForm.vue";

import { ref, onBeforeMount } from "vue";
import { client } from "../../api/index";
import { Peer } from "peerjs";

import { useAuthStore } from "../../stores/auth.store.ts";
import { useCalendarStore } from "../../stores/calendar.store.ts";

import moment from "moment-timezone";

const authStore = useAuthStore();
const calendarStore = useCalendarStore();

const toast = useToast();

const taskVisible = ref(false);
const eventVisible = ref(false);
const meetingVisible = ref(false);
const projectVisible = ref(false);
const taskInitialValues = ref({});
const eventInitialValues = ref({});
const meetingInitialValues = ref({});

const items = [
  {
    label: "Task",
    command: () => {
      taskVisible.value = true;
    },
  },
  {
    label: "Event",
    command: () => {
      eventVisible.value = true;
    },
  },
  {
    label: "Meeting",
    command: () => {
      meetingVisible.value = true;
    },
  },
  {
    separator: true,
  },
  {
    label: "Project",
    command: () => {
      projectVisible.value = true;
    },
  },
];

const loading = ref(false);
const nlpInput = ref("");
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};
function nlp() {
  loading.value = true;
  client.calendar.calendarNPL
    .mutate({ userInput: nlpInput.value })
    .then((res) => {
      console.log(res);

      // update view
      loading.value = false;
      op.value.toggle();
      nlpInput.value = "";

      // process response
      if (res.type == "meeting") {
        meetingInitialValues.value = Object.assign(
          {},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.start_time && {
            start_time: moment(res.start_time).local().toDate(),
          },
          res.end_time && { end_time: moment(res.end_time).local().toDate() },
          res.rrule && { repeat: true },
          res.rrule &&
            res.rrule.match(/FREQ=([^;]+)/)?.[1] && {
              frequency: res.rrule.match(/FREQ=([^;]+)/)?.[1],
            },
          res.rrule &&
            res.rrule.match(/INTERVAL=([^;]+)/)?.[1] && {
              interval: parseInt(res.rrule.match(/INTERVAL=([^;]+)/)?.[1]),
            },
          res.rrule &&
            res.rrule.match(/BYDAY=([^;]+)/)?.[1] && {
              byday: res.rrule.match(/BYDAY=([^;]+)/)?.[1].split(","),
            },
          res.rrule &&
            res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
              bymonthday: res.rrule
                .match(/BYMONTHDAY=([^;]+)/)?.[1]
                .split(",")
                .map((monthday) => parseInt(monthday)),
            },
          res.rrule &&
            res.rrule.match(/UNTIL=([^;]+)/)?.[1] && {
              until: moment(res.rrule.match(/UNTIL=([^;]+)/)?.[1]).toDate(),
            },
        );
        meetingVisible.value = true;
      } else if (res.type == "event") {
        eventInitialValues.value = Object.assign(
          {},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.start_time && {
            start_time: moment(res.start_time).local().toDate(),
          },
          res.end_time && { end_time: moment(res.end_time).local().toDate() },
          res.rrule && { repeat: true },
          res.rrule &&
            res.rrule.match(/FREQ=([^;]+)/)?.[1] && {
              frequency: res.rrule.match(/FREQ=([^;]+)/)?.[1],
            },
          res.rrule &&
            res.rrule.match(/INTERVAL=([^;]+)/)?.[1] && {
              interval: parseInt(res.rrule.match(/INTERVAL=([^;]+)/)?.[1]),
            },
          res.rrule &&
            res.rrule.match(/BYDAY=([^;]+)/)?.[1] && {
              byday: res.rrule.match(/BYDAY=([^;]+)/)?.[1].split(","),
            },
          res.rrule &&
            res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
              bymonthday: res.rrule
                .match(/BYMONTHDAY=([^;]+)/)?.[1]
                .split(",")
                .map((monthday) => parseInt(monthday)),
            },
          res.rrule &&
            res.rrule.match(/UNTIL=([^;]+)/)?.[1] && {
              until: moment(res.rrule.match(/UNTIL=([^;]+)/)?.[1]).toDate(),
            },
        );
        eventVisible.value = true;
      } else if (res.type == "task") {
        taskInitialValues.value = Object.assign(
          {},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.deadline && { deadline: moment(res.deadline).local().toDate() },
        );
        taskVisible.value = true;
      } else {
        console.error("Unrecognized type");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

const selectedProjects = ref([]);
const projects = ref([]);
function getProject() {
  const range = calendarStore.calendarService.getRange();
  const queryRange = {
    start_date: moment(range.start).local().utc().toISOString(),
    end_date: moment(range.end).local().utc().toISOString(),
  };

  const events = [];
  const meetings = [];

  const promises = selectedProjects.value.map((project) =>
    client.calendar.getCalendar.query({
      project_id: project.id,
      ...queryRange,
    }),
  );

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((res) => {
        const projectEvents = res.calendar.events.map((event) => {
          const calendarEvent = {
            id: event.id,
            title: event.name,
            description: event.description,
            location: event.location,
            start: moment
              .utc(event.start_time)
              .local()
              .format("YYYY-MM-DD HH:mm"),
            end: moment.utc(event.end_time).local().format("YYYY-MM-DD HH:mm"),
            type: "event",
          };
          if (event.rrule) {
            calendarEvent.rrule = event.rrule;
          }
          return calendarEvent;
        });

        const projectMeetings = res.calendar.meetings.map((meeting) => {
          const calendarMeeting = {
            id: meeting.id,
            title: meeting.name,
            description: meeting.description,
            location: meeting.location,
            start: moment
              .utc(meeting.start_time)
              .local()
              .format("YYYY-MM-DD HH:mm"),
            end: moment
              .utc(meeting.end_time)
              .local()
              .format("YYYY-MM-DD HH:mm"),
            type: "meeting",
          };
          if (meeting.rrule) {
            calendarMeeting.rrule = meeting.rrule;
          }
          return calendarMeeting;
        });

        events.push(...projectEvents);
        meetings.push(...projectMeetings);
      });

      calendarStore.setEvents(events.concat(meetings));
    })
    .catch((err) => {
      console.error(err);
      toast.add({
        severity: "error",
        summary: "Failed to retrieve events.",
        life: 3000,
      });
    });
}

onBeforeMount(() => {
  client.projects.getProjectbyLead
    .query({ uid: authStore.user })
    .then((res) => {
      const projectsLead = res.projects;
      client.projects.getProjectbyParticipant
        .query({ uid: authStore.user })
        .then((res) => {
          const projectsParticipate = res.projects;
          projects.value = projectsLead.concat(projectsParticipate);
        })
        .catch((err) => {
          console.error(err);
          toast.add({
            severity: "error",
            summary: "Failed to retrieve projects.",
            life: 3000,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      toast.add({
        severity: "error",
        summary: "Failed to retrieve projects.",
        life: 3000,
      });
    });
});
</script>

<style lang="css" scoped>
.calendar-drawer-container {
  padding: var(--sx-spacing-padding6) 0;
  position: sticky;
  top: var(--sx-spacing-padding6);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nlp-instruction {
  margin-bottom: 1rem;
}

.nlp-container {
  padding: 0.5rem;
}

.nlp-input-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.project-listbox {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
