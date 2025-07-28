import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TicTacToe from './components/TicTacToe';
import Chat from './components/Chat';
import { SocketProvider } from './contexts/SocketContext';

export default function App() {
  console.log('App: Rendering with SocketProvider');
  
  return (
    <SocketProvider>
      <View style={styles.container}>
        <TicTacToe />
        <Chat />
      </View>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d4e57',
  },
});
