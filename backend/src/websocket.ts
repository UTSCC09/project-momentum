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
      type: 'connect',
      senderId: 'server',
      payload: {
        clientId: clientId,
      }
    }));
  
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      const { senderId, type, payload } = message;
  
      console.log(`Message received from ${senderId}:`, message);

      if (type === 'join') {
        const participants = meetings.get(payload.meetingId);
        if (participants) {
          ws.send(JSON.stringify({
            type: 'join',
            senderId: 'server',
            payload: {
              participants: Array.from(participants),
            }
          }));
          participants.add(senderId);
        }
        else {
          ws.send(JSON.stringify({
            type: 'join',
            senderId: 'server',
            payload: {
              participants: new Array<string>(),
            }
          }));
          const newParticipants = new Set<string>();
          newParticipants.add(senderId);
          meetings.set(payload.meetingId, newParticipants);
        }
      }
      else if (payload.receiverId) {
        const socket = clients.get(payload.receiverId);
        if (socket)
          socket.send(JSON.stringify(message));
        else
          console.warn(`No client found: ${payload.receiverId}`);
      }
      else {
        console.warn('Unrecognized message format');
      }
    });
  
    ws.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      meetings.forEach((participants) => {
        if (participants.has(clientId)) {
          participants.delete(clientId);
          participants.forEach((participant) => {
            const socket = clients.get(participant);
            if (socket)
              socket.send(JSON.stringify({
                type: 'disconnect', senderId: clientId, payload: {}
              }));
            else
              console.warn(`No client found: ${clientId}`);
          })
        }
      })
      clients.delete(clientId);
    });
  }); 
}