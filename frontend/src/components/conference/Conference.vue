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
      <div v-for="[key, item] in peers" :key="key" class="video">
        <Video :videoId="key" :displayControls="false" :videoStream="item.peerStream" :pauseVideo="pauseVideo"
          :pauseAudio="pauseAudio" :muted="false">
        </Video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Video from './Video.vue';

import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWebSocketStore } from '../../stores/websocket.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { servers } from '../../utils/ice-servers.ts';

type Peer = {
  pc: RTCPeerConnection, peerStream: MediaStream, peerVideo: HTMLVideoElement,
}

let myClientId: string;

const route = useRoute();
const meetingId = ref<string>('');

const peers = ref<Map<string, Peer>>(new Map<string, Peer>());
const localStream = ref<MediaStream | null>(null);

const websocketStore = useWebSocketStore();
const authStore = useAuthStore();

function createPeerConnection(peerId: string, description?: RTCSessionDescription) {
  console.log("creating peerconnection with", peerId);
  const pc = new RTCPeerConnection({ iceServers: servers })
  peers.value.set(peerId, {
    pc: pc,
    peerStream: undefined,
    peerVideo: undefined,
  });

  // send message to all participants when ice candidate is discovered
  pc.onicecandidate = ({ candidate }) => {
    if (!candidate) return;
    setTimeout(() => {
      websocketStore.send({
        type: 'ice-candidate', senderId: myClientId,
        payload: {
          receiverId: peerId,
          'ice-candidate': candidate,
        }
      });
    }, 500);
  }

  // receive media stream and add to peer connection
  pc.ontrack = (event) => {
    console.log("receiving media stream");
    console.log(event);
    const peer = peers.value.get(peerId);
    if (peer) {
      peer.peerVideo = peer.peerVideo || document.getElementById(peerId);
      if (!peer.peerVideo.srcObject && event.streams && event.streams[0]) {
        peer.peerStream = event.streams[0];
        peer.peerVideo.srcObject = peer.peerStream;
      }
    }
  }

  // add local stream to peer connection
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => {
      pc.addTrack(track, localStream.value);
    });
  }

  if (description) {
    // set remote description
    pc.setRemoteDescription(description)
      .then(() => {
        console.log(`setRemoteDescription: finished`);
        createAnswer(pc, peerId);
      })
      .catch((err) => {
        console.error(`Error setting the RemoteDescription: ${err}`);
      });
  }
  else {
    createOffer(pc, peerId);
  }
}

function createAnswer(pc: RTCPeerConnection, peerId: string) {
  console.log(`${authStore.user} create an answer: start`);
  pc.createAnswer()
    .then((answer) => {
      console.log(`${authStore.user} setLocalDescription: start`);
      pc.setLocalDescription(answer)
        .then(() => {
          console.log(`${authStore.user} setLocalDescription: finished`);
          websocketStore.send({
            type: 'answer', senderId: myClientId,
            payload: { receiverId: peerId, answer: answer, }
          });

          console.log("ICE gathering state:", pc.iceGatheringState);
          console.log("LocalDescription:", pc.localDescription);
          console.log("RemoteDescription:", pc.remoteDescription);
        })
        .catch((err) => {
          console.error(`Error setting LocalDescription: ${err}`);
        })
    })
    .catch((err) => {
      console.error(`Error creating answer: ${err}`);
    });
}

function createOffer(pc: RTCPeerConnection, peerId: string) {
  console.log(`${authStore.user} wants to start a call with ${peerId}`);
  pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  })
    .then((offer) => {
      console.log(`${authStore.user} setLocalDescription: start`);
      pc.setLocalDescription(offer)
        .then(() => {
          console.log(`${authStore.user} setLocalDescription: finished`);
          websocketStore.send({
            type: 'offer', senderId: myClientId,
            payload: { receiverId: peerId, offer: offer, }
          });

          console.log("ICE gathering state:", pc.iceGatheringState);
          console.log("LocalDescription:", pc.localDescription);
          console.log("RemoteDescription:", pc.remoteDescription);
        })
        .catch((err) => {
          console.error(`Error setting the LocalDescription: ${err}`);
        })
    })
    .catch((err) => {
      console.error(`Error creating offer: ${err}`);
    })
}

function handleMessage(message: any) {
  const { senderId, type, payload } = message;

  if (type === 'offer') {
    console.log('Received offer from:', senderId);
    createPeerConnection(senderId, payload.offer);
  }
  else if (type === 'answer') {
    console.log('Received answer from:', senderId);
    const peer = peers.value.get(senderId)
    if (peer)
      peer.pc.setRemoteDescription(payload.answer)
        .then(() => {
          console.log(`setRemoteDescription: finished`);
        })
        .catch((err) => {
          console.error(`Error setting the RemoteDescription: ${err}`);
        });
  }
  else if (type === 'ice-candidate') {
    console.log('Received ICE candidate from:', senderId);
    const peer = peers.value.get(senderId);
    if (peer && payload['ice-candidate']) {
      peer.pc.addIceCandidate(new RTCIceCandidate(payload['ice-candidate']))
        .catch((error) => {
          console.error('Error adding ICE candidate:', error);
        });
    }
  }
  else if (type === 'connect') {
    myClientId = payload.clientId;

    websocketStore.send({
      type: 'join',
      senderId: myClientId,
      payload: {
        meetingId: meetingId.value,
      }
    });
  }
  else if (type === 'join') {
    for (const peerId of payload.participants) {
      createPeerConnection(peerId);
    }
  }
  else if (type === 'disconnect') {
    const peer = peers.value.get(senderId);
    if (peer) {
      peer.pc.close();
      peers.value.delete(senderId);
    }
    else {
      console.warn('Cannot find user:', senderId);
    }
  }
  else {
    console.warn('Unrecognized message type from:', senderId);
  }
}

function pauseAudio() {
  localStream.value.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
}

function pauseVideo() {
  localStream.value.getVideoTracks().forEach(t => (t.enabled = !t.enabled))
}

onMounted(() => {
  // get meetingId
  meetingId.value = route.params.id;

  // initialize local video
  const constraints = {
    video: true,
    audio: true,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.log('Got local stream:', stream);
      localStream.value = stream;

      // set local video
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      // initialize websocket and wait for message
      websocketStore.connect('ws://localhost:3000');
      websocketStore.socket?.addEventListener('message', (event) => {
        handleMessage(JSON.parse(event.data));
      });
    })
    .catch((err) => {
      console.error('Error accessing media devices:', err);
    });
});

onBeforeUnmount(() => {
  peers.value.forEach((peer) => {
    peer.pc.close();
  });
  peers.clear();
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