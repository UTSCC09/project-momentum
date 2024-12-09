<template>
  <div class="conference-container">
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

    <div class="conference-footer">
      <AudioVideoControls :pauseVideo="pauseVideo" :pauseAudio="pauseAudio" :disconnect="disconnect"
        :numParticipants="numParticipants" :meetingName="meetingName">
      </AudioVideoControls>
    </div>
  </div>
</template>

<script setup lang="ts">
import Video from "./Video.vue";
import AudioVideoControls from "./AudioVideoControls.vue";

import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebSocketStore } from "../../stores/websocket.store.ts";
import { useAuthStore } from "../../stores/auth.store.ts";
import { servers } from "../../utils/ice-servers.ts";

import { client } from "../../api/index";

type Peer = {
  pc: RTCPeerConnection;
  peerStream: MediaStream;
  peerVideo: HTMLVideoElement;
};

let myClientId: string;

const route = useRoute();
const router = useRouter();

const meetingId = ref<string>("");
const peers = ref<Map<string, Peer>>(new Map<string, Peer>());
const localStream = ref<MediaStream | null>(null);
const numParticipants = ref<Number>(1);
const meetingName = ref<String>("");

const websocketStore = useWebSocketStore();
const authStore = useAuthStore();

function createPeerConnection(
  peerId: string,
  description?: RTCSessionDescription,
) {
  const pc = new RTCPeerConnection({ iceServers: servers });
  peers.value.set(peerId, {
    pc: pc,
    peerStream: undefined,
    peerVideo: undefined,
  });
  numParticipants.value = peers.value.size + 1;

  // send message to all participants when ice candidate is discovered
  pc.onicecandidate = ({ candidate }) => {
    if (!candidate) return;
    setTimeout(() => {
      websocketStore.send({
        type: "ice-candidate",
        senderId: myClientId,
        payload: {
          receiverId: peerId,
          "ice-candidate": candidate,
        },
      });
    }, 500);
  };

  // receive media stream and add to peer connection
  pc.ontrack = (event) => {
    const peer = peers.value.get(peerId);
    if (peer) {
      peer.peerVideo = peer.peerVideo || document.getElementById(peerId);
      if (!peer.peerVideo.srcObject && event.streams && event.streams[0]) {
        peer.peerStream = event.streams[0];
        peer.peerVideo.srcObject = peer.peerStream;
      }
    }
  };

  // add local stream to peer connection
  if (localStream.value) {
    localStream.value.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.value);
    });
  }

  if (description) {
    // set remote description
    pc.setRemoteDescription(description)
      .then(() => {
        createAnswer(pc, peerId);
      })
      .catch((err) => {
        toast.add({
          severity: "error",
          summary: `Error setting RemoteDescription.`,
          detail: err.message,
          life: 3000,
        });
      });
  } else {
    createOffer(pc, peerId);
  }
}

function createAnswer(pc: RTCPeerConnection, peerId: string) {
  pc.createAnswer()
    .then((answer) => {
      pc.setLocalDescription(answer)
        .then(() => {
          websocketStore.send({
            type: "answer",
            senderId: myClientId,
            payload: { receiverId: peerId, answer: answer },
          });
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: `Error setting LocalDescription.`,
            detail: err.message,
            life: 3000,
          });
        });
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Error creating answer.`,
        detail: err.message,
        life: 3000,
      });
    });
}

function createOffer(pc: RTCPeerConnection, peerId: string) {
  pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  })
    .then((offer) => {
      pc.setLocalDescription(offer)
        .then(() => {
          websocketStore.send({
            type: "offer",
            senderId: myClientId,
            payload: { receiverId: peerId, offer: offer },
          });
        })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: `Error setting LocalDescription.`,
            detail: err.message,
            life: 3000,
          });
        });
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Error creating offer.`,
        detail: err.message,
        life: 3000,
      });
    });
}

function handleMessage(message: any) {
  const { senderId, type, payload } = message;

  if (type === "offer") {
    createPeerConnection(senderId, payload.offer);
  } else if (type === "answer") {
    const peer = peers.value.get(senderId);
    if (peer)
      peer.pc
        .setRemoteDescription(payload.answer)
        .then(() => { })
        .catch((err) => {
          toast.add({
            severity: "error",
            summary: `Error setting RemoteDescription.`,
            detail: err.message,
            life: 3000,
          });
        });
  } else if (type === "ice-candidate") {
    const peer = peers.value.get(senderId);
    if (peer && payload["ice-candidate"]) {
      peer.pc
        .addIceCandidate(new RTCIceCandidate(payload["ice-candidate"]))
        .catch((error) => {
          toast.add({
            severity: "error",
            summary: `Error adding ICE candidate.`,
            detail: error.message,
            life: 3000,
          });
        });
    }
  } else if (type === "connect") {
    myClientId = payload.clientId;

    websocketStore.send({
      type: "join",
      senderId: myClientId,
      payload: {
        meetingId: meetingId.value,
      },
    });
  } else if (type === "join") {
    for (const peerId of payload.participants) {
      createPeerConnection(peerId);
    }
  } else if (type === "disconnect") {
    const peer = peers.value.get(senderId);
    if (peer) {
      peer.pc.close();
      peers.value.delete(senderId);
      numParticipants.value = peers.value.size + 1;
    } else {
      toast.add({
        severity: "error",
        summary: `Cannot find user ${senderId}.`,
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: `Unrecognized message type from ${senderId}.`,
      life: 3000,
    });
  }
}

function pauseAudio() {
  localStream.value.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
}

function pauseVideo() {
  localStream.value.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
}

function disconnect() {
  if (localStream.value) {
    localStream.value.getTracks().forEach((track) => {
      track.stop();
    });
  }

  peers.value.forEach((peer) => {
    peer.pc.close();
  });

  peers.value.clear();
  numParticipants.value = 0;
  meetingName.value = "";

  websocketStore.socket?.close();

  router.push("/all");
}

onMounted(() => {
  // get meetingId
  meetingId.value = route.params.id;

  // get meeting name
  client.meetings.getMeeting
    .query({ meetingId: meetingId.value })
    .then((res) => {
      meetingName.value = res.meeting.name;
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Failed to get meeting.`,
        detail: err.message,
        life: 3000,
      });
    });

  // initialize local video
  const constraints = {
    video: true,
    audio: true,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      localStream.value = stream;

      // set local video
      const localVideo = document.getElementById(
        "localVideo",
      ) as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      // initialize websocket and wait for message
      websocketStore.connect("wss://momentum-app.ca/ws/");
      websocketStore.socket?.addEventListener("message", (event) => {
        handleMessage(JSON.parse(event.data));
      });
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Error accessing media devices.`,
        detail: err.message,
        life: 3000,
      });
    });
});

onBeforeUnmount(() => {
  disconnect();
});
</script>

<style lang="css" scoped>
.conference-container {
  background-color: var(--p-primary-950);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.conference-container-videos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 2rem 0 2rem;
  align-items: center;
  flex-grow: 1;
}

.video {
  flex: 0 0 calc((100% - 2rem) / 3);
  /* 10px = 2 * gap */
  margin: none;
  border-radius: var(--p-border-radius-md);
}

/* the case with 2 elements */
.video:first-child:nth-last-child(2),
.video:first-child:nth-last-child(2)~* {
  flex: 0 0 calc((100% - 1rem) / 2);
}

.video:first-child:nth-last-child(1),
.video:first-child:nth-last-child(1)~* {
  flex: 0 0 100%;
}

.conference-footer {
  width: 100%;
}
</style>
