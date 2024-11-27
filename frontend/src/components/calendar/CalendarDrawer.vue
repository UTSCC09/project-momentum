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
      // webrtc();
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

function webrtc() {
  const authStore = useAuthStore();
  const peer = new Peer(authStore.user);
  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    if (peer.id == "b3d9c12c-fc9f-40b1-8f4c-01cf66b76da6") {
    console.log("connecting");
    const conn = peer.connect('0cfa9bcb-92ed-429f-b9b4-430b83f4ea73');
    conn.on('open', function () {
      console.log("OPEN");
      // Receive messages
      conn.on('data', function (data) {
        console.log('Received', data);
      });

      // Send messages
      conn.send('Hello!');
    });
    conn.on("error", function (err) {
      console.log(err);
    });
  }
  else {
    console.log("receiving")
    peer.on('connection', function (conn) {
      conn.on('open', function () {
        console.log("OPEN");
        // Receive messages
        conn.on('data', function (data) {
          console.log('Received', data);
        });

        // Send messages
        conn.send('Hello too!');
      });
      conn.on("error", function (err) {
        console.log(err);
      })
    });
  }
  });
  peer.on("error", function (err) {
    console.log(err);
  });
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
