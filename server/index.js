const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/messages', messageRoutes);

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // broadcast to all
  });

  socket.on('deleteMessage', (id) => {
    io.emit('messageDeleted', id);
  });

  socket.on('undoMessage', (message) => {
    io.emit('messageUndone', message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
