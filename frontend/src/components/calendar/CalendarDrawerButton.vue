<template>
  <Button icon="pi pi-bars" @click="$emit('toggle-drawer')"/>
</template>

<script setup>
import Button from "primevue/button";
</script>

<style lang="css" scoped>
.sx__calendar-wrapper button {
  background-color: var(--p-button-primary-background);
}
</style>
