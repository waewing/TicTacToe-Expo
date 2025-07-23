require("dotenv").config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require ("socket.io");


const PORT = process.env.PORT

const app = express();
const server = http.createServer(app);
const io = new Server( server, {
    cors: {
        origin : "*",
    }
});

let waitingPlayer = null;

io.on('connection', (socket) => {
    console.log('Player connected: ', socket.id);

    if (waitingPlayer) {
        const room = `room-${ socket.id }-${ waitingPlayer.id }`;
        socket.join(room);
        waitingPlayer.join(room);

        io.to(room).emit('startGame', { room, symbol : 'O'});
        waitingPlayer.emit('startGame', { room, symbol : 'X'});

        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
    }

    socket.on('makeMove', ({ room, board }) => {
        const xCount = board.filter(cell => cell === 'X').length;
        const oCount = board.filter(cell => cell === 'O').length;
        const nextTurn = xCount > oCount ? 'O' : 'X';
        io.to(room).emit('updateBoard', { board, nextTurn });
    });
    
    socket.on('disconnet', () => {
        console.log('User Disconnected: ', socket.id);
        if (waitingPlayer === socket) waitingPlayer = null;
    });

});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});