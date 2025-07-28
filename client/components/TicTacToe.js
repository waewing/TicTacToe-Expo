import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [symbol, setSymbol] = useState(null);
  const [myTurn, setmyTurn] = useState(false);
  const [room, setRoom] = useState(null); 
  const symbolRef = useRef(null);
  const { socket, isConnecting, isConnected } = useSocket();

  useEffect(() => {
    symbolRef.current = symbol;
  }, [symbol]);

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }
    socket.on('startGame', ({ room: gameRoom, symbol: playerSymbol }) => {
      setRoom(gameRoom);
      setSymbol(playerSymbol);
      setmyTurn(playerSymbol === 'X');
    });

    socket.on('updateBoard', ({ board: newboard, nextTurn }) => {
      setBoard(newboard);
      setmyTurn(nextTurn === symbolRef.current);
    });

    return () => {
      if (socket) {
        socket.off('startGame');
        socket.off('updateBoard');
      }
    };
  }, [socket, isConnected, isConnecting]);

  const handleClick = (index) => {
    if (!myTurn || board[index] || !symbol || !socket) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    setmyTurn(false);
    
    socket.emit('makeMove', { room, board: newBoard });
  };

    return (
    <View style={styles.container}>
      <Text style={styles.heading}>You are: {symbol}</Text>
      <View style={styles.grid}>
        {board.map((cell, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleClick(idx)}
            style={styles.cell}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#3d4e57',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  grid: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 32,
  },
});