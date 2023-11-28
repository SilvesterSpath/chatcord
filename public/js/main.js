const socket = io();

// Join chatroom (this message will be in the browser's console)
socket.on('message', (message) => {
  console.log(message);
});
