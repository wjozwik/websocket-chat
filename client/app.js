const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) =>
  addMessage('Chat Bot', `<i>${user} has joined the conversation!</i>`)
);
socket.on('userLeft', (user) =>
  addMessage('Chat Bot', `<i>${user} has left the conversation... :(</i>`)
);

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const login = e => {
  e.preventDefault();
  if (userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', { author: userName, id: socket.id });
  } else {
    alert('Login is required!');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  message.innerHTML = `<h3 class="message__author">${
    author === userName ? 'You' : author
  }</h3><div class="message__content">${content}</div>`;
  messagesList.appendChild(message);
};

const sendMesage = e => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContentInput.value.length > 0) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {
      author: userName,
      content: messageContent,
    });
    messageContentInput.value = '';
  } else {
    alert('Add message.');
  }
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMesage);