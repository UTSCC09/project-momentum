<template>
  <Button icon="pi pi-bars" @click="toggle" />
</template>

<script setup lang="ts">
import Button from "primevue/button";

import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const route = useRoute();

function toggle() {
  if (route.fullPath == "/all") {
    router.push("/schedule");
  } else {
    router.push("/all");
  }
}
</script>

<style lang="css" scoped>
.sx__calendar-wrapper button {
  background-color: var(--p-button-primary-background);
}
</style>
