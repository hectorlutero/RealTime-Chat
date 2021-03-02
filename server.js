const http      = require('http');
const express   = require('express');
const path      = require('path');
const socketio  = require('socket.io');

const app       = express();
const server    = http.createServer(app);
const io        = socketio(server);


// socket.emit('message', 'Welcome dude!');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('New WS Connection...');

    socket.emit('message', 'Welcome dude!');
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));