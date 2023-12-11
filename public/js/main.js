const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
  parseArrays: false,
  delimiter: '&',
  strictNullHandling: true,
  allowDots: true,
});

// Username and room from the query string
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

// Messages from server
socket.on('messages', (messages) => {
  console.log(messages);
  messages.forEach((message) => outputMessage(message));
  // Scroll down
  const objDiv = document.querySelector('.chat-messages');
  objDiv.scrollTop = objDiv.scrollHeight;
});

// User and room info
socket.on('roomUsers', ({ users, room }) => {
  console.log(users, room);
  outputUsers(users);
  outputRooms(room);
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

  // Create delete button
  const deleteBtn = document.createElement('button');

  deleteBtn.classList.add('delete');
  deleteBtn.innerText = 'X';
  deleteBtn.dataset.id = message._id;
  deleteBtn.addEventListener('click', () => {
    const _id = deleteBtn.dataset.id;
    const confirm = window.confirm(
      'Are you sure you want to delete this message?'
    );
    // Emit delete event
    socket.emit('deleteMessage', _id);

    // Remove message from DOM
    div.remove();
  });

  div.appendChild(deleteBtn);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output users and rooms
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
}

// Output rooms
function outputRooms(room) {
  roomName.innerText = room;
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
