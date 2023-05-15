import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import Nav from '../Nav';
import Tournament from '../Tournament';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react';


export default function App() {
  const db = SQLite.openDatabase('walleyeStampede.db');
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentTournament, setCurrentTournament] = useState({undefined});

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists tournaments (id integer primary key not null autoincrement, name text, startDate date, endDate date);');
    });

    db.transaction(tx => {
      tx.executeSql('select * from tournaments;', null , 
      (txObj, resultSet) => setData(resultSet.rows._array),
      (txObj, error) => console.log('Error', error));
    });

    setLoading(false);
  }, []);
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const showData = () => {
    return data.map((item, index) => {
      return (
        <View key={index}>
          <Text>{item.name}</Text>
        </View>
      )
    });
  }



  return (
    <View style={styles.container}>
      <Nav />
      <Text>This app is for the Walleye Stampede. Please deposit $10,000</Text>
      <Tournament data = {data}></Tournament>
      <StatusBar style="auto" />
      <TextInput value = {currentTournament} onChangeText={setCurrentTournament} placeholder="Enter Tournament Name"></TextInput>
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
