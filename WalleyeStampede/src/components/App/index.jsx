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
        // tx.executeSql('DROP TABLE IF EXISTS tournaments;', [], 
        //   () => console.log('Drop successful'),
        //   (_, error) => { console.log('Error dropping table: ', error); return true; }
        // );
    
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS tournaments (id integer primary key not null, name text, startDate text, endDate text);', [],
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
      
      tx.executeSql('insert into tournaments (name, startDate, endDate) values (?, ?, ?);', [currentTournament, startDate, endDate], 
      (txObj, resultSet) => {
        let existingTournaments = [...tournaments];
        existingTournaments = [...existingTournaments, {id: resultSet.insertId, name: currentTournament, startDate: startDate, endDate: endDate}];
        setTournaments(existingTournaments);
        setCurrentTournament(undefined);
      },
      (txObj, error) => console.log('Error', error));
    });
  }

  const deleteTournament = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from tournaments where id = ?;', [id],
      (txObj, resultSet) => {
        let existingTournaments = [...tournaments];
        existingTournaments = existingTournaments.filter(tournament => tournament.id !== id);
        setTournaments(existingTournaments);
      },
      (txObj, error) => console.log('Error', error));
    });
  }

  

  let tournamentList = 'loading'

  if (tournaments.length > 0) {
    tournamentList = tournaments.map(tournament => {
      let startString = tournament.startDate.toString();
      let endString = tournament.endDate.toString();
      return (
        <Text key={tournament.id}>
          {tournament.name} {startString} {endString}
          <Button title="Delete" onPress={() => deleteTournament(tournament.id)}/>
        </Text>
      )
    })
    console.log(tournamentList)
  }

  
  const onChangeStart = (event, selectedDate) => {
    
    const currentDate = selectedDate || date;
    setStartDate(currentDate);
   
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
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
        onChange={onChangeStart}
      />
      <DateTimePicker
        testID = 'endDate'
        value = {endDate}
        is24Hour={true}
        onChange={onChangeEnd}
      />
      
      <Button title="Add Tournament" onPress={addTournament}/>
        <Text>{tournamentList}</Text>
      
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
