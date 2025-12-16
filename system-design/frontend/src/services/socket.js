import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io('http://192.168.1.35:5000');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('sendMessage', messageData);
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  offMessage() {
    if (this.socket) {
      this.socket.off('receiveMessage');
    }
  }
}

export default new SocketService();