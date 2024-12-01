<template>
  <div class="footer">
    <div class="info">
      <div class="name">{{ meetingName }}</div>
      <Badge :value="numParticipants" severity="secondary"></Badge>
    </div>
    <div class="controls">
      <Button v-if="!audioOn" @click="swapAudio()" icon="pi pi-microphone" aria-label="microphone" />
      <Button v-else @click="swapAudio()" severity="secondary" icon="pi pi-microphone" aria-label="microphone" />
      <Button v-if="!videoOn" @click="swapVideo()" icon="pi pi-video" aria-label="video" />
      <Button v-else @click="swapVideo()" severity="secondary" icon="pi pi-video" aria-label="video" />
      <Button label="Leave" severity="danger" @click="disconnect()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';

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
  disconnect: {
    type: Function,
    required: true,
  },
  numParticipants: {
    type: Number,
    required: false,
  },
  meetingName: {
    type: String,
    required: true,
  },
});

const videoOn = ref(true);
const audioOn = ref(true);

function swapVideo() {
  videoOn.value = !videoOn.value;
  props.pauseVideo();
}

function swapAudio() {
  audioOn.value = !audioOn.value;
  props.pauseAudio();
}
</script>

<style lang="css" scoped>
.controls {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  gap: 0.5rem;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: 0 2rem;
  align-items: center;
}

.name {
  color: var(--p-surface-100);
  font-size: large;
  font-weight: bold;
}

.info {
  display: flex;
  gap: 5pt;
}
</style>
