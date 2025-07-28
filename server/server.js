require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require ('socket.io');


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

        socket.emit('startGame', { room, symbol: 'O' });
        waitingPlayer.emit('startGame', { room, symbol: 'X' });

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

    socket.on('chatMessage', ({ room, message }) => {
        io.to(room).emit('chatMessage', { 
            message, 
            sender: `Player ${socket.id.slice(-4)}`
        });
    });
    
    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
        if (waitingPlayer === socket) waitingPlayer = null;
    });

});

server.listen(3000, () => {
    console.log("Server running on http://192.168.1.162:3000");
});