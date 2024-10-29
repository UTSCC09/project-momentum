<template>
  <div class="calendar-drawer-container">
    <SplitButton label="Create" @click="save" :model="items" />
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
const items = [
  {
    label: 'Task',
    command: () => {
      console.log("Update");
    }
  },
  {
    label: 'Event',
    command: () => {
      console.log("Delete");
    }
  },
  {
    separator: true
  },
  {
    label: 'Meeting',
    command: () => {
      window.location.href = 'https://vuejs.org/';
    }
  }
];

const save = () => {
  console.log("Save");
};
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
