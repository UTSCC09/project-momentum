import { defineStore } from "pinia";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null as WebSocket | null,
  }),
  actions: {
    connect(url: string) {
      this.socket = new WebSocket(url);
    },
    send(message: Record<string, any>) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN)
        this.socket.send(JSON.stringify(message));
    },
    close() {
      this.socket.close();
    },
  },
});
