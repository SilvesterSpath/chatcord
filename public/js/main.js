const chatForm = document.getElementById('chat-form');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
  parseArrays: false,
  delimiter: '&',
  strictNullHandling: true,
  allowDots: true,
});

console.log(username, room);

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Join chatroom (this message will be in the browser's console too)
// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  const objDiv = document.querySelector('.chat-messages');
  objDiv.scrollTop = objDiv.scrollHeight;
});

// User and room info
socket.on('roomUsers', ({ users, room }) => {
  console.log(users, room);
  outputUsers(users);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emitting message to server
  socket.emit('chatMessage', {
    username,
    room,
    text: msg,
  });

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const p2 = document.createElement('p');
  p2.classList.add('text');
  p2.innerText = message.text;
  div.appendChild(p2);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output users
function outputUsers(users) {
  const userList = document.getElementById('users');
  const roomName = document.getElementById('room-name');

  roomName.innerText = users[0].room;

  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
}
