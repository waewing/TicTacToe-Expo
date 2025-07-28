import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TicTacToe from './components/TicTacToe';
import Chat from './components/Chat';

export default function App() {
  
  return (
      <View style={styles.container}>
        <TicTacToe />
        <Chat />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d4e57',
  },
});
