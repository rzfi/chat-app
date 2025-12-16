import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { SERVER_URL } from './config/network';
import './App.css';

let socket = null;

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Initialize socket connection
  useEffect(() => {
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      setError('');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
      setError('Connection failed. Check if server is running.');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Join chat
  const joinChat = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to join with username:', username);
      console.log('Server URL:', SERVER_URL);
      
      const res = await axios.post(`${SERVER_URL}/api/join`, { 
        username: username.trim() 
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Join response:', res.data);
      
      if (res.data.success) {
        setUser(res.data.user);
        socket.emit('join', res.data.user);
        await fetchUsers();
        await fetchMessages();
        setError('');
      } else {
        setError(res.data.message || 'Failed to join chat');
      }
    } catch (error) {
      console.error('Join error:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Make sure the backend is running.');
      } else if (error.response) {
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        setError('No response from server. Check your connection.');
      } else {
        setError('Failed to join chat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/messages`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    
    socket.emit('sendMessage', {
      userId: user.id,
      username: user.username,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  // Clear chat
  const clearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all messages?')) return;
    
    try {
      await axios.delete(`${SERVER_URL}/api/messages/clear`);
      socket.emit('chatCleared');
    } catch (error) {
      console.error('Failed to clear chat:', error);
      setError('Failed to clear chat');
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('chatCleared', () => {
      setMessages([]);
    });

    socket.on('userJoined', (username) => {
      fetchUsers();
    });

    socket.on('userLeft', (username) => {
      fetchUsers();
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('chatCleared');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  if (!user) {
    return (
      <div className="app">
        <div className="join-container">
          <div className="logo">
            <h1>💬 Chat App</h1>
            <p>Connect and chat with everyone!</p>
          </div>
          
          <div className="connection-status">
            <span className={`status ${connectionStatus}`}>
              {connectionStatus === 'connected' && '✅ Connected'}
              {connectionStatus === 'disconnected' && '🔴 Disconnected'}
              {connectionStatus === 'error' && '❌ Connection Error'}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && joinChat()}
              disabled={loading || connectionStatus !== 'connected'}
              maxLength={20}
            />
            <button 
              onClick={joinChat} 
              disabled={loading || !username.trim() || connectionStatus !== 'connected'}
              className="join-btn"
            >
              {loading ? 'Joining...' : 'Join Chat'}
            </button>
          </div>
          
          <div className="server-info">
            <small>Server: {SERVER_URL}</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <h2>💬 Welcome, {user.username}!</h2>
            <span className="connection-indicator">
              {connectionStatus === 'connected' ? '🟢' : '🔴'} {connectionStatus}
            </span>
          </div>
          <button onClick={clearChat} className="clear-btn">
            🗑️ Clear Chat
          </button>
        </div>
        
        <div className="chat-content">
          <div className="sidebar">
            <div className="sidebar-header">
              <h3>👥 Users ({users.length})</h3>
            </div>
            <div className="users-list">
              {users.map((u) => (
                <div key={u._id} className="user-item">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{u.username}</span>
                  {u._id === user.id && <span className="you-badge">You</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="main-chat">
            <div className="messages">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>💬 No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}>
                    <div className="message-header">
                      <strong className="sender-name">{msg.sender.username}</strong>
                      <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))
              )}
            </div>
            
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                maxLength={500}
                disabled={connectionStatus !== 'connected'}
              />
              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                className="send-btn"
              >
                🚀 Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
