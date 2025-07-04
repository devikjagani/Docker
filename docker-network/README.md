**Docker network project** where multiple containers communicate over a custom Docker network.

* One **Node.js app container**
* One **MongoDB container**
* Both connected via a **user-defined Docker bridge network**

---

## 📦 Project Structure

```
docker-network-project/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── index.js
```
# run project
```
https://github.com/atulkamble/docker-network-project.git
cd docker-network-project
docker compose up --build -d

sudo docker network ls
sudo docker container ls
sudo docker images

http://instance-ip:3000
tip: update inbound rule: custom tcp 3000 (0.0.0.0/0)
```
---

## 📄 Example `package.json`

```json
{
  "name": "docker-network-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0"
  }
}
```

---

## 📄 Example `index.js`

```javascript
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
```

---

## 📄 Example `Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

---

## 📄 Example `docker-compose.yml`

```yaml
version: '3'

services:
  app:
    build: .
    container_name: node_app
    ports:
      - "3000:3000"
    networks:
      - customnet
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    container_name: mongo
    ports:
      - "27017:27017"
    networks:
      - customnet

networks:
  customnet:
    driver: bridge
```

---

## 📦 Build & Run

```bash
docker compose up --build -d
```

* App runs at: [http://localhost:3000](http://localhost:3000)
* App connects to `mongo` container using hostname `mongo` because they're on the same custom bridge network `customnet`.

---

## ✅ What This Demonstrates:

* **Custom Docker bridge networks**
* **Service discovery using container names**
* **Multi-container communication**
* Cleanly separated services via **Docker Compose**
