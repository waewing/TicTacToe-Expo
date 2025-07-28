import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Button, TextInput } from 'react-native-web';
import { useSocket } from '../contexts/SocketContext';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState(['Chat History']);
    const [room, setRoom] = useState(null);
    const { socket, isConnecting, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        socket.on('chatMessage', ({ message: incomingMessage, sender }) => {
            setMessageHistory(prev => [...prev, `${sender}: ${incomingMessage}`]);
        });

        return () => {
            if (socket) {
                socket.off('chatMessage');
            }
        };
    }, [socket, isConnected, isConnecting]);

    const handleClick = () => {
        if (!socket || !message.trim() || !room) return;

        socket.emit('chatMessage', { room, message });
        
        setMessage('');
    };
    
    return (
        <View>
            <Text>{messageHistory.join('\n')}</Text>
            <TextInput 
                placeholder='Chat here!' 
                value={message} 
                onChangeText={setMessage} 
            />
            <Button title="Send" onPress={handleClick} />
        </View>
    )
}