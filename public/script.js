const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'chat';

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;

  const db = client.db(dbName);
  const messagesCollection = db.collection('messages');

  // Endpoint to save messages
  app.post('/messages', (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).send('Invalid input');
    }

    messagesCollection.insertOne({ username, message, timestamp: new Date() }, (err, result) => {
      if (err) {
        return res.status(500).send('Error saving message');
      }
      res.status(201).send('Message saved');
    });
  });

  // Endpoint to retrieve messages
  app.get('/messages', (req, res) => {
    messagesCollection
      .find({})
      .sort({ timestamp: 1 })
      .toArray((err, messages) => {
        if (err) {
          return res.status(500).send('Error retrieving messages');
        }
        res.status(200).json(messages);
      });
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
