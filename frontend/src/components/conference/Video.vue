<template>
  <div class="video">
    <div v-if="!videoStream" class="video-spinner">
      <ProgressSpinner />
    </div>

    <video :id="videoId" autoplay="true" muted v-if="muted"></video>
    <video :id="videoId" autoplay="true" v-else></video>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  videoStream: {
    type: MediaStream,
    required: false,
  },
  muted: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="css" scoped>
video {
  width: 100%;
  height: 100%;
}

.video-spinner {
  position: absolute;
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
