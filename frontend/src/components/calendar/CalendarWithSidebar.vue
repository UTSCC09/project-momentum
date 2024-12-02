<template>
  <div class="calendar-container">
    <div class="calendar-drawer">
      <CalendarDrawer />
    </div>
    <div class="calendar-main">
      <Calendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarDrawer from './CalendarDrawer.vue';
import Calendar from './Calendar.vue';
</script>

<style lang="css" scoped>
.calendar-container {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
}

.calendar-drawer-background {
  flex: 1 0 35vw;
  padding: var(--sx-spacing-padding6);
}

.calendar-main {
  flex: 6 0 65vw;
}
</style>