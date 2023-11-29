const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getUsersInRoom,
  userLeave,
  getCurrentUser,
} = require('./utils/users');

dotenv.config({ path: './config/.env' });

// Initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'CharCord Bot';

// Run when client connects
io.on('connection', (socket) => {
  console.log('A client connected');

  // Join chatroom
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // Join room
    socket.join(user.room);

    // client side welcome message
    socket.emit(
      'message',
      formatMessage(botName, `${username} welcome to the ${room} chat!`)
    );

    // Broadcast when a user connects, except who connected
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${username} has joined the ${room} chat!`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      users: getUsersInRoom(user.room),
      room: user.room,
    });
  });

  // Runs when client sends a message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(msg.username, msg.text));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    const users = getUsersInRoom(user?.room);
    io.emit(
      'message',
      formatMessage(
        botName,
        `${user?.username} has left the ${user?.room} chat!`
      )
    );

    // Send users and room info
    io.to(user?.room).emit('roomUsers', {
      users: getUsersInRoom(user?.room),
      room: user?.room,
    });
    console.log(users ?? 'No users');
    console.log('Client disconnected');
  });
});

// Run server
const PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
