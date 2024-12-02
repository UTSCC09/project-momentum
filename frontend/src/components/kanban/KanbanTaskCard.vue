<template>
  <Card>
    <template #title>{{ task.title }}</template>
    <template #subtitle>{{ task.date }}</template>
    <template #content>
      <p>{{ task.description }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

defineProps({
  task: {
    type: Object,
    default: () => {},
  }
});
</script>

<style lang="css" scoped>
</style>