const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('userJoined', username);
  });

  socket.on('sendMessage', (data) => {
    const { username, content } = data;
    const message = { username, content, timestamp: new Date() };
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit('userLeft', username);
      delete users[socket.id];
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
