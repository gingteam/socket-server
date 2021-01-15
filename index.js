const http = require('http');
const express = require('express');
const socket = require('socket.io');
const md5 = require('md5');

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
var expires = 0;

app.get('/', (req, res) => res.send('Server working...'));

const io = socket(server, {
  cors: {
    origin: process.env.DOMAIN || ['localhost'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.on('chat', (data) => {
    expires = Math.floor(Date.now()/1000) - 5;
    if (data.time > expires) {
      if (data.token == md5(process.env.SECRET + data.time)) {
        io.emit('chat', data);
      }
    } else {
      console.log('bad input');
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
