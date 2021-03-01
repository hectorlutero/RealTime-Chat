const http      = require('http');
const socketio  = require('socket.io'); 
const path      = require('path');

// Calling Express 
const express = require('express');

const app = express();
const server = http.createServer(app); 
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('New WS Connection...')
});

socket.emit('message', 'welcome new comer');

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
