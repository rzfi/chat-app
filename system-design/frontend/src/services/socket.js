import io from 'socket.io-client';
import { SERVER_URL } from '../config/network';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SERVER_URL);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();