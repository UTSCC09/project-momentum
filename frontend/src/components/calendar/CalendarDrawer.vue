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

      <Dialog v-model:visible="projectVisible" modal header="Create Project" :style="{ width: '50vw' }">
        <ProjectForm @close="projectVisible = false;" />
      </Dialog>

      <Button label="Test" @click="test" style="margin-top: 1rem;"></Button>

      <div style="margin-top: 1rem;">
        <Button type="button" icon="pi pi-sparkles" label="NLP" @click="toggle" />
        <Popover ref="op">
          <div class="nlp-container">
            <div class="nlp-instruction">How can I help you?</div>
            <div class="nlp-input-container">
              <InputText type="text" v-model="nlpInput" />
              <Button icon="pi pi-send" severity="secondary" aria-label="Submit" @click="useNLP" />
            </div>
          </div>
        </Popover>
      </div>

      <div class="project-listbox">
        <Listbox v-model="selectedCity" :options="cities" multiple optionLabel="name" />
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Popover from 'primevue/popover';
import InputText from 'primevue/inputtext';
import Listbox from 'primevue/listbox';

import TaskForm from '../forms/TaskForm.vue';
import EventForm from '../forms/EventForm.vue';
import MeetingForm from '../forms/MeetingForm.vue';
import ProjectForm from '../forms/ProjectForm.vue';

import { ref } from 'vue';
import { client } from "../../api/index";
import { Peer } from "peerjs";

import { useAuthStore } from "../../stores/auth.store.ts";

const taskVisible = ref(false);
const eventVisible = ref(false);
const meetingVisible = ref(false);
const projectVisible = ref(false);

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

const nlpInput = ref("");
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
function useNLP() {
  console.log(nlpInput.value); // remember to use .value to get the input
}

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
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
