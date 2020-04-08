const http = require('http');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Server working...'));

const io = socket(server, {
  cors: {
    origin: process.env.DOMAIN,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('user connected: ' + socket.id);
  socket.onAny((event, data) => {
    console.log(socket.id + ' send: '+ data);
    io.emit(event, data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});
