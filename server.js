const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow your React app's origin
    methods: ['GET', 'POST'],
  },
});

// Apply CORS middleware
app.use(cors());

app.get('/', (req, res) => {
  res.send('WebRTC signaling server is running');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle offer event
  socket.on('offer', (data) => {
    console.log('Offer received:', data);
    socket.broadcast.emit('offer', data); // Send offer to the other peer
  });

  // Handle answer event
  socket.on('answer', (data) => {
    console.log('Answer received:', data);
    socket.broadcast.emit('answer', data); // Send answer to the other peer
  });

  // Handle ICE candidates
  socket.on('ice-candidate', (data) => {
    console.log('ICE candidate received:', data);
    socket.broadcast.emit('ice-candidate', data); // Send ICE candidate to the other peer
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
