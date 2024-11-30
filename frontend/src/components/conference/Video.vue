<template>
  <div class="video">
    <div class="video-spinner">
      <ProgressSpinner />
    </div>

    <AudioVideoControls v-if="displayControls" :pauseVideo="pauseVideo" :pauseAudio="pauseAudio">
    </AudioVideoControls>
    <video :id="videoId" autoplay="true" muted="muted" v-if="muted">
    </video>
    <video :id="videoId" autoplay="true" v-if="!muted">
    </video>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import AudioVideoControls from "./AudioVideoControls.vue";

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  displayControls: {
    type: Boolean,
    required: true,
  },
  videoStream: {
    type: MediaStream,
    required: false,
  },
  pauseAudio: {
    type: Function,
    required: true,
  },
  pauseVideo: {
    type: Function,
    required: true,
  },
});
</script>

<style lang="css" scoped>
.video {
  background-color: #353535;
  height: 100%;
  position: relative;
}

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
