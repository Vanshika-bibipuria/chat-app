// src/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:5050', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
