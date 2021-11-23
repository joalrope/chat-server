//Servidor con express
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
//import { dbConnection } from './database/config.js';

const app = express();
const server = http.createServer(app);

config();
//dbConnection();

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  let nickName;

  socket.on('connecting', (user) => {
    nickName = user;
    socket.broadcast.emit('messages', {
      nickName,
      message: `${nickName} ha entrado al chat`,
    });
  });

  socket.on('message', (nickName, message) => {
    io.emit('messages', { nickName, message });
  });

  socket.on('disconnect', () => {
    io.emit('messages', {
      servidor: 'Servidor',
      mensaje: `${nickName} se ha retirado del chat`,
    });
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () =>
  console.log(`Servidor escuchando en el Puerto ${PORT}`)
);
