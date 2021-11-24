//Servidor con express
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
//import { dbConnection } from './database/config.js';

const app = express();
const httpServer = createServer(app);

config();
//dbConnection();
const { pathname } = new URL('public/index.html', import.meta.url);
app.get('/', function (req, res) {
  res.sendFile(pathname);
});

const io = new Server(httpServer, {
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

  socket.on('disconnecting', () => {
    console.log('desconectando en el servidor');
    io.emit('messages', {
      nickName: 'Servidor',
      message: `${nickName} se ha retirado del chat`,
    });
  });
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () =>
  console.log(`Servidor escuchando en el Puerto ${PORT}`)
);
