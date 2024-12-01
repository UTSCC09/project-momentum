<template>
  <div class="conference-container">
    <div class="conference-container-header">
      <h3>Private conference (up to 3)</h3>
    </div>

    <div class="conference-container-videos">
      <div class="video">
        <Video videoId="localVideo" :displayControls="true" :videoStream="localStream" :pauseVideo="pauseVideo"
          :pauseAudio="pauseAudio" :muted="true">
        </Video>
      </div>
      <div v-for="(item, key) in peers" :key="key" class="video">
        <Video :videoId="key" :displayControls="false" :videoStream="peers[key].peerStream" :muted="false">
        </Video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Video from './Video.vue';

import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWebSocketStore } from '../../stores/websocket.store.ts';
import { servers } from '../../utils/ice-servers.ts'

let myClientId: string;

const route = useRoute();
const meetingId = route.params.id;

const props = defineProps({
  conference: {
    type: Object,
    required: true,
  },
});

const peers = ref<Record<string, { peerStream: MediaStream }>>({});
const peerConnections = ref<Map<string, RTCPeerConnection>>(new Map<string, RTCPeerConnection>());
const localStream = ref<MediaStream | null>(null);

const websocketStore = useWebSocketStore();

function initWebSocket() {
  websocketStore.connect('ws://localhost:3000');

  websocketStore.socket?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('Received signaling message:', message);
    handleMessage(message);
  });
}

function handleMessage(message: any) {
  const { senderId, type, payload } = message;

  if (type === 'offer') {
    console.log('Received offer from:', senderId);
    createAnswer(message);
  }
  else if (type === 'answer') {
    console.log('Received answer from:', senderId);
    const peerConnection = peerConnections.value.get(senderId);
    if (peerConnection) {
      const remoteDesc = new RTCSessionDescription(payload.answer);
      peerConnection.setRemoteDescription(payload.answer)
        .catch((error) => {
          console.error('Error setting remote description for answer:', error);
        });
    }
  }
  else if (type === 'ice-candidate') {
    console.log('Received ICE candidate from:', senderId);
    // Add ICE candidate to the corresponding peer connection
    const peerConnection = peerConnections.value.get(senderId);
    if (peerConnection && payload.candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate))
        .catch((error) => {
          console.error('Error adding ICE candidate:', error);
        });
    }
  }
  else if (type === 'client-id') {
    myClientId = payload.clientId;
    console.log(myClientId);

    websocketStore.sendMessage({
      type: 'active-users',
      senderId: myClientId,
      payload: {
        meetingId: meetingId,
      }
    });
  }
  else if (type === 'active-users') {
    payload.users.forEach((peerId) => createOffer(peerId));
  }
  else {
    console.warn('Unrecognized message type from:', senderId);
  }
}

async function createAnswer(message: any) {
  const { senderId, type, payload } = message;

  const peerConnection = new RTCPeerConnection({
    iceServers: servers,
  });
  peerConnections.value.set(senderId, peerConnection);

  setupPeerConnection(peerConnection, senderId);
  peerConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
      websocketStore.sendMessage({
        type: 'ice-candidate', senderId: myClientId,
        payload: { receiverId: senderId, 'ice-candidate': event.candidate }
      });
    }
  });

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  websocketStore.sendMessage({
    type: 'answer', senderId: myClientId,
    payload: { receiverId: senderId, answer: answer }
  });
}

async function createOffer(peerId: string) {
  const peerConnection = new RTCPeerConnection({
    iceServers: servers,
  });
  peerConnections.value.set(peerId, peerConnection);

  setupPeerConnection(peerConnection, peerId);
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
      websocketStore.sendMessage({
        type: 'ice-candidate', senderId: myClientId,
        payload: { receiverId: peerId, 'ice-candidate': event.candidate }
      });
    }
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  websocketStore.sendMessage({
    type: 'offer', senderId: myClientId,
    payload: { receiverId: peerId, offer: offer }
  });
}

function initMediaStream() {
  const constraints = {
    video: true,
    audio: true,
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.log('Got local stream:', stream);
      localStream.value = stream;

      // Set the local video element's stream
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      peerConnections.value.forEach((peerConnection, peerId) => {
        localStream.value.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream.value);
        });
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
}

function handlePeerConnect(peerId: string, stream: MediaStream) {
  peers.value[peerId] = {
    peerStream: stream,
  };

  console.log("peers", peers.value);
}

function handlePeerDisconnect(peerId: string) {
  if (peers.value[peerId]) {
    delete peers.value[peerId];
  }
}

function setupPeerConnection(peerConnection: RTCPeerConnection, peerId: string) {
  // add tracks
  if (localStream.value)
    localStream.value.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream.value);
    });

  // receive tracks
  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    handlePeerConnect(peerId, remoteStream);
  };

  peerConnection.onconnectionstatechange = () => {
    if (peerConnection.connectionState === 'disconnected') {
      handlePeerDisconnect(peerId);
    }
  };
}

onBeforeUnmount(() => {
  if (websocketStore.socket) {
    websocketStore.close();
  }
});

onMounted(() => {
  initMediaStream();
  initWebSocket();
});
</script>

<style lang="css" scoped>
.conference-container {
  background-color: black;
  height: 100%;
  width: 400px;
}

.conference-container-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
}

.conference-container-videos {
  position: relative;
  border: solid 1px #ffffff78;
}

h3 {
  padding-left: 1rem;
  color: white;
}

.video {
  width: 100%;
  height: 250px;
}
</style>