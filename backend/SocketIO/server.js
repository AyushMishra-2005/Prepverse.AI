import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://prepverse-ai-python-server.onrender.com', 'https://prepverse-ai.onrender.com', 'http://127.0.0.1:3000'];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
})

const users = {};

const getUserSocketId = (receiverId) => {
  return users[receiverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("New client connected:", socket.id, "User ID:", userId);

  if (userId) {
    users[userId] = socket.id;
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
        console.log(`Removed user ${id}`);
        break;
      }
    }
  });
});

export { app, io, server, getUserSocketId }























