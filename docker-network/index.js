const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://mongo:27017/networkdemo';

// MongoDB Connection
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB container'))
  .catch(err => console.error(err));

// Define a simple Message schema
const messageSchema = new mongoose.Schema({
  content: String,
});

// Create a Message model
const Message = mongoose.model('Message', messageSchema);

// Seed database with some messages if empty
async function seedMessages() {
  const count = await Message.countDocuments();
  if (count === 0) {
    await Message.insertMany([
      { content: 'Hello from Docker!' },
      { content: 'This message comes from MongoDB container.' },
      { content: 'Docker networks make multi-container communication easy.' },
    ]);
    console.log('✅ Sample messages added to database');
  }
}

// Home route to fetch and display messages
app.get('/', async (req, res) => {
  const messages = await Message.find();
  let responseHtml = `<h1>📦 Docker Network Project</h1>
                      <h2>Messages from MongoDB:</h2>
                      <ul>`;
  messages.forEach(msg => {
    responseHtml += `<li>${msg.content}</li>`;
  });
  responseHtml += `</ul>`;
  res.send(responseHtml);
});

// Start server after seeding messages
app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
  seedMessages();
});
