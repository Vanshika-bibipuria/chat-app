const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db'); // this uses your MongoDB logic from db.js
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Example test route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// Message routes
const messageRoutes = require('./routes/messageRoutes'); // adjust path if needed
app.use('/api/messages', messageRoutes);

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
