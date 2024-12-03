<template>
  <div class="container">
    <div>
    <p>UI Credits</p>
    <ul>
      <li>Components: <a href="https://primevue.org/">PrimeVue</a></li>
      <li>Calendar: <a href="https://schedule-x.dev/">Schedule-X</a></li>
      <li>Vue: <a href="https://vuejs.org/">Vue</a></li>
      <li>AnimeJS: <a href="https://animejs.com/">AnimeJS</a></li>
    </ul>
  </div>
  <Button label="Return" @click="redirect"></Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

function redirect() {
  router.push("/");
}
</script>

<style lang="css" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>