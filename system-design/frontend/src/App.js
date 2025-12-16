import React, { useState, useEffect } from 'react';
import socketService from './services/socket';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isJoined) {
      const socket = socketService.connect();
      
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('userJoined', (user) => {
        setMessages(prev => [...prev, { username: 'System', content: `${user} joined the chat`, timestamp: new Date(), isSystem: true }]);
      });

      socket.on('userLeft', (user) => {
        setMessages(prev => [...prev, { username: 'System', content: `${user} left the chat`, timestamp: new Date(), isSystem: true }]);
      });

      return () => socketService.disconnect();
    }
  }, [isJoined]);

  const joinChat = () => {
    if (username.trim()) {
      setIsJoined(true);
      const socket = socketService.connect();
      socket.emit('join', username);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socketService.socket) {
      socketService.socket.emit('sendMessage', { username, content: newMessage });
      setNewMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className="app">
        <div className="join-container">
          <h1>Chat Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinChat()}
          />
          <button onClick={joinChat}>Join Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Room</h2>
          <span>Welcome, {username}!</span>
        </div>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isSystem ? 'system' : msg.username === username ? 'own' : 'other'}`}>
              {!msg.isSystem && <span className="username">{msg.username}</span>}
              <span className="content">{msg.content}</span>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
