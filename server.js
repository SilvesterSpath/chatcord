const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

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
  console.log('New websocket connection..');

  socket.emit('message', 'Welcome to chatcord!');
});

// Run server
const PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
