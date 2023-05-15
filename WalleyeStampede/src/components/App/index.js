import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, DatePickerIOSBase} from 'react-native';
import Nav from '../Nav';
import Tournament from '../Tournament';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function App() {
  const db = SQLite.openDatabase('walleyeStampede.db');
  const [isLoading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [currentTournament, setCurrentTournament] = useState(undefined);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS tournaments;', [], 
          () => console.log('Drop successful'),
          (_, error) => { console.log('Error dropping table: ', error); return true; }
        );
    
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS tournaments (id integer primary key not null, name text, startDate date, endDate date);', [],
          () => { console.log('Table created or already exists'); },
          (_, error) => { console.log('Error occurred while creating the table: ', error); return true; }
        );
      });
      db.transaction(tx => {
        tx.executeSql('select * from tournaments;', [],
          (_, { rows: { _array } }) => setTournaments(_array),
          (_, error) => console.log('Error', error)
        );
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

  const addTournament = () => {
    db.transaction(tx => {
      tx.executeSql('insert into tournaments (name, startDate, endDate) values (?);', [currentTournament], 
      (txObj, resultSet) => {
        let existingTournaments = [...tournaments];
        existingTournaments = [...existingTournaments, {id: resultSet.insertId, name: currentTournament, startDate: startDate, endDate: endDate}];
        setTournaments(existingTournaments);
        setCurrentTournament(undefined);
      },
      (txObj, error) => console.log('Error', error));
    });
  }

  const showTournaments = () => {
    return tournaments.map((item, index) => {
      return (
        <View key={index}>
          <Text>{item.name}</Text>
        </View>
      );
    });
  }


  
  const onChange = (event, selectedDate) => {
    console.log(event.testID);
    const currentDate = selectedDate || date;
    setStartDate(currentDate);
    setEndDate(currentDate);
  };


  return (
    <View style={styles.container}>
      <Nav />
      <Text>This app is for the Walleye Stampede. Please deposit $10,000</Text>
      
      <StatusBar style="auto" />
      <TextInput value ={currentTournament} onChangeText={setCurrentTournament} placeholder="Enter Tournament Name"/>
      <DateTimePicker
        testID = 'startDate'
        value = {startDate}
        is24Hour={true}
        onChange={onChange}
      />
      <DateTimePicker
        testID = 'endDate'
        value = {endDate}
        is24Hour={true}
        onChange={onChange}
      />
      
      <Button title="Add Tournament" onPress={addTournament}/>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 0
  }
});
