<template>
  <Card>
    <template #title>{{ task.title }}</template>
    <template #subtitle>{{ task.date }}</template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </p>
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