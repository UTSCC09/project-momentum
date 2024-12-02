<template>
  <div class="calendar-drawer-background">
    <div class="calendar-drawer-container">
      <SplitButton label="Create" icon="pi pi-sparkles" :model="items" @click="toggle" />

      <Popover ref="op">
        <div class="nlp-container">
          <div class="nlp-instruction">How can I help you?</div>
          <div class="nlp-input-container">
            <InputText type="text" v-model="nlpInput" />
            <Button icon="pi pi-send" severity="secondary" aria-label="Submit" @click="nlp" />
          </div>
        </div>
      </Popover>

      <Dialog v-model:visible="taskVisible" modal header="Create Task" :style="{ width: '50vw' }">
        <TaskForm :initialValues="taskInitialValues" @close="taskVisible = false;" />
      </Dialog>

      <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
        <EventForm :initialValues="eventInitialValues" @close="eventVisible = false;" />
      </Dialog>

      <Dialog v-model:visible="meetingVisible" modal header="Create Meeting" :style="{ width: '50vw' }">
        <MeetingForm :initialValues="meetingInitialValues" @close="meetingVisible = false;" />
      </Dialog>

      <Dialog v-model:visible="projectVisible" modal header="Create Project" :style="{ width: '50vw' }">
        <ProjectForm @close="projectVisible = false;" />
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Popover from 'primevue/popover';
import InputText from 'primevue/inputtext';

import TaskForm from '../forms/TaskForm.vue';
import EventForm from '../forms/EventForm.vue';
import MeetingForm from '../forms/MeetingForm.vue';
import ProjectForm from '../forms/ProjectForm.vue';

import { ref } from 'vue';
import { client } from "../../api/index";

import moment from 'moment-timezone';

const taskVisible = ref(false);
const eventVisible = ref(false);
const meetingVisible = ref(false);
const projectVisible = ref(false);
const taskInitialValues = ref({});
const eventInitialValues = ref({});
const meetingInitialValues = ref({});

const items = [
  {
    label: 'Task',
    command: () => {
      taskVisible.value = true;
    }
  },
  {
    label: 'Event',
    command: () => {
      eventVisible.value = true;
    }
  },
  {
    label: 'Meeting',
    command: () => {
      meetingVisible.value = true;
    }
  },
  {
    separator: true
  },
  {
    label: 'Project',
    command: () => {
      projectVisible.value = true;
    }
  }
];

const nlpInput = ref("");
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
function nlp() {
  client.calendar.calendarNPL.mutate({ userInput: nlpInput.value })
    .then((res) => {
      console.log(res);
      if (res.type == 'meeting') {
        meetingInitialValues.value = Object.assign({},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.start_time && { start_time: moment(res.start_time).local().toDate() },
          res.end_time && { end_time: moment(res.end_time).local().toDate() },
          res.rrule && { repeat: true },
          res.rrule && res.rrule.match(/FREQ=([^;]+)/)?.[1] && { frequency: res.rrule.match(/FREQ=([^;]+)/)?.[1] },
          res.rrule && res.rrule.match(/INTERVAL=([^;]+)/)?.[1] && { interval: parseInt(res.rrule.match(/INTERVAL=([^;]+)/)?.[1]) },
          res.rrule && res.rrule.match(/BYDAY=([^;]+)/)?.[1] && { byday: res.rrule.match(/BYDAY=([^;]+)/)?.[1].split(',') },
          res.rrule && res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
            bymonthday: res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1]
              .split(',')
              .map((monthday) => parseInt(monthday))
          },
          res.rrule && res.rrule.match(/UNTIL=([^;]+)/)?.[1] && { until: moment(res.rrule.match(/UNTIL=([^;]+)/)?.[1]).toDate() },
        );
        meetingVisible.value = true;
      }
      else if (res.type == 'event') {
        eventInitialValues.value = Object.assign({},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.start_time && { start_time: moment(res.start_time).local().toDate() },
          res.end_time && { end_time: moment(res.end_time).local().toDate() },
          res.rrule && { repeat: true },
          res.rrule && res.rrule.match(/FREQ=([^;]+)/)?.[1] && { frequency: res.rrule.match(/FREQ=([^;]+)/)?.[1] },
          res.rrule && res.rrule.match(/INTERVAL=([^;]+)/)?.[1] && { interval: parseInt(res.rrule.match(/INTERVAL=([^;]+)/)?.[1]) },
          res.rrule && res.rrule.match(/BYDAY=([^;]+)/)?.[1] && { byday: res.rrule.match(/BYDAY=([^;]+)/)?.[1].split(',') },
          res.rrule && res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1] && {
            bymonthday: res.rrule.match(/BYMONTHDAY=([^;]+)/)?.[1]
              .split(',')
              .map((monthday) => parseInt(monthday))
          },
          res.rrule && res.rrule.match(/UNTIL=([^;]+)/)?.[1] && { until: moment(res.rrule.match(/UNTIL=([^;]+)/)?.[1]).toDate() },
        );
        eventVisible.value = true;
      }
      else if (res.type == 'task') {
        taskInitialValues.value = Object.assign({},
          res.name && { name: res.name },
          res.description && { description: res.description },
          res.location && { location: res.location },
          res.deadline && { deadline: moment(res.deadline).local().toDate() },
        );
        taskVisible.value = true;
      }
      else {
        console.error("Unrecognized type");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
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
}

.project-listbox {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
