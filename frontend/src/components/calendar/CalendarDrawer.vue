<template>
  <div class="calendar-drawer-container">
    <SplitButton label="Create" :model="items" />

    <Dialog v-model:visible="taskVisible" modal header="Create Task" :style="{ width: '50vw' }">
      <TaskForm @close="taskVisible = false;"/>
    </Dialog>

    <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
      <EventForm @close="eventVisible = false;"/>
    </Dialog>

    <Dialog v-model:visible="meetingVisible" modal header="Create Meeting" :style="{ width: '50vw' }">
      <EventForm @close="meetingVisible = false;"/>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
import Dialog from 'primevue/dialog';

import TaskForm from './TaskForm.vue';
import EventForm from './EventForm.vue';
import MeetingForm from './MeetingForm.vue';

import { ref } from 'vue';
import { client } from "../../api/index";
import { formatDate } from "../../api/utils";

const taskVisible = ref(false);
const eventVisible = ref(false);
const meetingVisible = ref(false);

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
      console.log("Project");
    }
  }
];
</script>

<style lang="css" scoped>
.calendar-drawer-container {
  padding: var(--sx-spacing-padding6);
  position: sticky;
  top: var(--sx-spacing-padding6);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
