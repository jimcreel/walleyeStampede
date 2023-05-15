import {View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

const data = [
        "Walleye Stampede",
        "Walleye Whirl",
       "Fish Fling"
]

export default function Tournament() {
    return (
        <View>
            <Text>Tournament</Text>
            <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index)
                }}
                defaultButtonText={"Select Tournament"}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    return item
                }}
            />

        </View>
        
    )
}