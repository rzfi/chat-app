import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    this.socket = io(serverUrl);
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