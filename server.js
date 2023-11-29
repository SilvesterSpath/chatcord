const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

dotenv.config({ path: './config/.env' });

// Initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', (socket) => {
  console.log('A client connected');

  // client side welcome message
  socket.emit('message', formatMessage('CharCord Bot', 'Welcome to the chat!'));

  // Broadcast when a use connects, except who connected
  socket.broadcast.emit(
    'message',
    formatMessage('CharCord Bot', 'A user has joined the chat!')
  );

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit(
      'message',
      formatMessage('CharCord Bot', 'A user has left the chat!')
    );
    console.log('Client disconnected');
  });

  // Runs when client sends a message
  socket.on('chatMessage', (msg) => {
    console.log(msg);
    io.emit('message', msg);
  });
});

// Run server
const PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
