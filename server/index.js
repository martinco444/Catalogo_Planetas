const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Persistencia en memoria (por sala)
const roomMessages = {};
const MAX_MESSAGES = 50;

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    // Enviar últimos mensajes al usuario que se une
    const messages = roomMessages[room] || [];
    socket.emit('chat_history', messages);
  });

  socket.on('message', ({ room, user, text }) => {
    if (!roomMessages[room]) roomMessages[room] = [];
    const msg = { user, text, timestamp: Date.now() };
    roomMessages[room].push(msg);
    // Limitar a los últimos 50 mensajes
    if (roomMessages[room].length > MAX_MESSAGES) {
      roomMessages[room] = roomMessages[room].slice(-MAX_MESSAGES);
    }
    io.to(room).emit('message', msg);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
