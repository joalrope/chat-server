const sendMessage = (socket, msg) => {
  const message = new Message({
    content: msg.content,
    name: msg.name,
  });

  message.save((err) => {
    if (err) return console.error(err);
  });

  socket.broadcast.emit('push', msg);
};
