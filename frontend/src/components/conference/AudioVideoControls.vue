<template>
  <div class="controls">
    <Button v-if="!audioOn" @click="swapAudio()" severity="secondary" icon="pi pi-microphone" aria-label="microphone" />
    <Button v-else @click="swapAudio()" icon="pi pi-microphone" aria-label="microphone" />
    <Button v-if="!videoOn" @click="swapVideo()" severity="secondary" icon="pi pi-video" aria-label="video" />
    <Button v-else @click="swapVideo()" icon="pi pi-video" aria-label="video" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { ref } from 'vue';

const props = defineProps({
  pauseVideo: {
    type: Function,
    required: true,
  },
  pauseAudio: {
    type: Function,
    required: true,
  },
});

const videoOn = ref(true);
const audioOn = ref(true);

function swapVideo() {
  videoOn.value = !videoOn.value;
  pauseVideo();
}

function swapAudio() {
  audioOn.value = !audioOn.value;
  pauseAudio();
}
</script>

<style lang="css" scoped>
.controls {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
