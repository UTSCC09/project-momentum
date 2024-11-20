<template>
  <div class="calendar-drawer-background">
    <div class="calendar-drawer-container">
      <SplitButton label="Create" :model="items" />

      <Dialog v-model:visible="taskVisible" modal header="Create Task" :style="{ width: '50vw' }">
        <TaskForm @close="taskVisible = false;" />
      </Dialog>

      <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
        <EventForm @close="eventVisible = false;" />
      </Dialog>

      <Dialog v-model:visible="meetingVisible" modal header="Create Meeting" :style="{ width: '50vw' }">
        <MeetingForm @close="meetingVisible = false;" />
      </Dialog>

      <Button label="Test" @click="test" style="margin-top: 1rem;"></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import TaskForm from '../forms/TaskForm.vue';
import EventForm from '../forms/EventForm.vue';
import MeetingForm from '../forms/MeetingForm.vue';

import { ref } from 'vue';

import { client } from "../../api/index";

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

function test() {
  fetch("http://localhost:3000/api/openai/getTaskSchedual", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_time: "2024-11-18T00:00:00Z",
      end_time: "2024-11-25T00:00:00Z", // Corrected year
      task: {
        name: "Test Task",
        description: "Finish my homework",
        deadline: "2024-11-25T00:00:00Z",
      }
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
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
