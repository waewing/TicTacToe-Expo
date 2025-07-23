import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TicTacToe from './components/TicTacToe';

export default function App() {
  return (
    <View style={styles.container}>
      <TicTacToe />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d4e57',
  },
});
