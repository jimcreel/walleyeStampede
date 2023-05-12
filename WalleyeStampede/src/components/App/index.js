import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Nav from '../Nav';
import Tournament from '../Tournament';

export default function App() {
  return (
    <View style={styles.container}>
      <Nav />
      <Text>This app is for the Walleye Stampede. Please deposit $10,000</Text>
      <Tournament></Tournament>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
