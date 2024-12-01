import { WebSocketServer } from "ws";

const meetings = new Map<string, Set<string>>();
const clients = new Map();

export function createWebSocketServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    const clientId = crypto.randomUUID();
    clients.set(clientId, ws);
  
    console.log(`New client connected: ${clientId}`);
  
    ws.send(JSON.stringify({
      type: 'client-id',
      senderId: 'server',
      payload: {
        clientId: clientId,
      }
    }));
  
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      const { senderId, type, payload } = message;
  
      console.log(`Message received from ${senderId}:`, message);

      if (type === 'active-users') {
        const users = meetings.get(payload.meetingId);
        if (users) {
          ws.send(JSON.stringify({
            type: 'active-users',
            senderId: 'server',
            payload: {
              users: Array.from(users),
            }
          }));
          users.add(senderId);
        }
        else {
          ws.send(JSON.stringify({
            type: 'active-users',
            senderId: 'server',
            payload: {
              users: new Array<string>(),
            }
          }));
          const newUsers = new Set<string>();
          newUsers.add(senderId);
          meetings.set(payload.meetingId, newUsers);
        }
      }
      else {
        const socket = payload.receiverId ? clients.get(payload.receiverId) : null;
        if (socket)
          socket.send(JSON.stringify(message));
        else
          console.warn(`No client found: ${payload.receiverId}`);
      }
    });
  
    ws.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      clients.delete(clientId);
    });
  }); 
}