const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
require('dotenv').config();

const Message = require('./models/Message');
const { dbConnection } = require('./database/config');
const PORT = process.env.PORT;

dbConnection();

//app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.static('public')); // Directorio publico (Archivos estaticos)

io.on('connection', (socket) => {
  Message.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec((err, messages) => {
      if (err) return console.error(err);

      socket.emit('init', messages);
    });

  socket.on('message', (msg) => {
    const message = new Message({
      content: msg.content,
      name: msg.name,
    });

    message.save((err) => {
      if (err) return console.error(err);
    });

    socket.broadcast.emit('push', msg);
  });
});

http.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
});
