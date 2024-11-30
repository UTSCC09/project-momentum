import { defineStore } from 'pinia';

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    socket: null as WebSocket | null,
  }),
  actions: {
    connect(url: string) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received:', message);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
      };
    },
    sendMessage(message: Record<string, any>) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not open');
      }
    },
    close() {
      this.socket.close();
    },
  },
});
