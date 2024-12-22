const socket = io();  // Connect to the Socket.IO server

// Listen for the 'receive message' event from the server
socket.on('receive message', (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    document.getElementById('messages').appendChild(messageDiv);
});

// Send the message to the server when the user clicks the send button
document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message) {
        socket.emit('send message', message);  // Send message to the server
        document.getElementById('message-input').value = '';  // Clear the input
    }
});
