import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { SERVER_URL, API_URL } from '../config/network';

const socket = io(SERVER_URL);

const ChatView = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit('join', user.id);
    };
    socket.on('connect', handleConnect);
    socket.emit('join', user.id); 
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on('chatCleared', () => {
      setMessages([]);
    });
    return () => {
      socket.off('connect', handleConnect);
      socket.off('receiveMessage');
      socket.off('chatCleared');
    };
  }, [user.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`${API_URL}/messages`, {
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit('sendMessage', {
        senderId: user.id,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${API_URL}/messages/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      socket.emit('chatCleared');
    } catch (error) {
      console.error('Failed to clear chat');
    }
  };

  return (
    <div className="chat-view">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Group Chat</h2>
        <button onClick={clearChat} style={{color: 'red', padding: '5px 10px'}}>Clear Chat</button>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}>
            <strong>{msg.sender.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatView;