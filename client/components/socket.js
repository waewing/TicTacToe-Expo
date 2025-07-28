import { io } from 'socket.io-client';

const socket = io('http://192.168.1.162:3000', {
  transports: ['websocket'],
});

export default socket;
