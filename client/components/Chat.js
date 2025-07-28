import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, ScrollView} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';


export default function Chat() {
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState(['Chat History']);
    const [room, setRoom] = useState(null);

    

    useEffect(() => {
        socket.on('startGame', ({ room: gameRoom, symbol: playerSymbol }) => {
            setRoom(gameRoom);
        });

        socket.on('chatMessage', ({ message: incomingMessage, sender }) => {
            setMessageHistory(prev => [...prev, `${sender}: ${incomingMessage}`]);
        });

        return () => {
            if (socket) {
                socket.off('chatMessage');
            }
        };
    }, [socket]);

    const handleClick = () => {
        if (!socket || !message.trim() || !room) return;

        socket.emit('chatMessage', { room, message });
        
        setMessage('');
    };
    
    return (
        <View style={styles.chatContainer}>
            <View style={styles.chatBox}>
                <ScrollView style={styles.chatScroll} contentContainerStyle={{ paddingBottom: 10 }}>
                    {messageHistory.map((msg, idx) => (
                        <Text key={idx} style={styles.chatText}>{msg}</Text>
                    ))}
             </ScrollView>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Chat here!"
                value={message}
                onChangeText={setMessage}
                placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleClick}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
  chatContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#2a3740',
    padding: 10,
    borderRadius: 10,
  },
  chatBox: {
    maxHeight: 120,
    backgroundColor: '#c7f8ff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  chatScroll: {
    maxHeight: 120,
  },
  chatText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#c7f8ff',
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#36727c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

