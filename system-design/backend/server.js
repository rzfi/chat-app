const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${process.env.MONGO_URI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple user login/join
app.post('/api/join', async (req, res) => {
  const { username } = req.body;
  
  if (!username || !username.trim()) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    let user = await User.findOne({ username: username.trim() });
    if (!user) {
      user = new User({ username: username.trim() });
      await user.save();
      console.log(`✅ New user created: ${username}`);
    } else {
      console.log(`🔄 Existing user joined: ${username}`);
    }
    res.json({ 
      success: true,
      user: { id: user._id, username: user.username } 
    });
  } catch (error) {
    console.error('❌ Join error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to join chat',
      error: error.message 
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username joinedAt').sort({ joinedAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('❌ Users fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .populate('sender', 'username')
      .limit(100); // Limit to last 100 messages
    res.json(messages);
  } catch (error) {
    console.error('❌ Messages fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Clear all messages
app.delete('/api/messages/clear', async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} messages`);
    res.json({ 
      success: true,
      message: `Deleted ${result.deletedCount} messages` 
    });
  } catch (error) {
    console.error('❌ Clear messages error:', error);
    res.status(500).json({ message: 'Failed to clear messages' });
  }
});

const activeUsers = {};

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join', (userData) => {
    activeUsers[socket.id] = userData;
    socket.broadcast.emit('userJoined', userData.username);
    console.log(`👋 ${userData.username} joined the chat`);
  });

  socket.on('sendMessage', async (data) => {
    const { userId, username, content } = data;
    try {
      const message = new Message({ sender: userId, content });
      await message.save();
      await message.populate('sender', 'username');
      io.emit('receiveMessage', message);
      console.log(`💬 ${username}: ${content}`);
    } catch (error) {
      console.error('❌ Message save error:', error);
    }
  });

  socket.on('chatCleared', () => {
    io.emit('chatCleared');
    console.log('🗑️ Chat cleared by user');
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    const userData = activeUsers[socket.id];
    if (userData) {
      socket.broadcast.emit('userLeft', userData.username);
      delete activeUsers[socket.id];
      console.log(`👋 ${userData.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ================================');
  console.log('🚀    CHAT SERVER STARTED');
  console.log('🚀 ================================');
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.112.110:${PORT}`);
  console.log('🚀 ================================');
});
