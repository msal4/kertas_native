import React, { useState } from 'react';
import { View, Platform, Text } from 'react-native';
import { Dialog, Button } from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Touchable } from "./Touchable";

function DateComponent(props) {
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={props.selectedDate}
      mode={"date"}
      display={Platform.OS === "ios"? "spinner": "calendar"}
      onChange={(e, date) => {
        if(Platform.OS === 'android') {
          props.onChange(date);
          props.onDismiss();
        }else{
          props.setSelectedDate(date);
        }
      }}
    />
  )
}

export default function DatePicker(props) {
  const [selectedDate, setSelectedDate] = useState(props.value);

  if(Platform.OS === 'android' && props.showed) {
    return <DateComponent onChange={props.onChange} onDismiss={props.onDismiss} selectedDate={selectedDate} />
  }
  return (
    <View>
      <Dialog
        migrate
        useSafeArea
        bottom={true}
        height={300}
        panDirection={'DOWN'}
        visible={props.showed}
        onDismiss={props.onDismiss}
      >
        <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20 }}>
          <DateComponent setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
          <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
            <View style={{ borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
              <Touchable onPress={() => {
                props.onChange(selectedDate);
                props.onDismiss();
              }}>
                <View style={{ backgroundColor: "#d5d5d5", padding: 10 }}>
                  <Text style={{ fontFamily: "Dubai-Regular" }}>Confirm</Text>
                </View>
              </Touchable>
            </View>
            <View style={{ borderRadius: 5, overflow: "hidden", marginTop: 10, marginHorizontal: 10 }}>
              <Touchable onPress={() => {
                props.onDismiss();
              }}>
                <View style={{ backgroundColor: "#eee", padding: 10 }}>
                  <Text style={{ fontFamily: "Dubai-Regular" }}>Cancel</Text>
                </View>
              </Touchable>
            </View>
          </View>
        </View>
      </Dialog>
    </View>
  )
}