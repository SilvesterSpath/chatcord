const chatForm = document.getElementById('chat-form');

const socket = io();

// Join chatroom (this message will be in the browser's console too)
// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emitting message to server
  socket.emit('chatMessage', msg);
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = 'Silvester';
  p.innerHTML += `<span> 10:11</span>`;
  div.appendChild(p);
  const p2 = document.createElement('p');
  p2.classList.add('text');
  p2.innerText = message;
  div.appendChild(p2);
  document.querySelector('.chat-messages').appendChild(div);
}
