const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Path to the messages JSON file
const messagesFilePath = path.join(__dirname, 'messages.json');

// Read the messages from the JSON file
const readMessages = () => {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];  // Return empty array if file doesn't exist or can't be read
  }
};

// Write messages to the JSON file
const writeMessages = (messages) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
};

// POST endpoint to save a message
app.post('/messages', (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message are required' });
  }

  const messages = readMessages();

  const newMessage = {
    username,
    message,
    timestamp: new Date(),
  };

  messages.push(newMessage);

  writeMessages(messages);

  res.status(201).json({ message: 'Message saved' });
});

// GET endpoint to retrieve all messages
app.get('/messages', (req, res) => {
  const messages = readMessages();
  res.status(200).json(messages);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
