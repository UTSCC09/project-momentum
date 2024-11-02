<script setup lang="ts">
import CalendarDrawer from './components/calendar/CalendarDrawer.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-drawer">
      <CalendarDrawer />
    </div>
    <div class="calendar-main">
      <RouterView />
    </div>
  </div>
</template>

<style lang="css" scoped>
.calendar-container {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
}

.calendar-drawer {
  flex: 1 0 15vw;
  padding: var(--sx-spacing-padding6);
}

.calendar-main {
  flex: 6 0 85vw;
}
</style>
