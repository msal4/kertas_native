import React, { useState } from "react";
import { View, Platform, Text, useColorScheme } from "react-native";
import { Dialog, PanningProvider } from "react-native-ui-lib";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Touchable } from "./Touchable";
import { useTrans } from "../context/trans";

function _DatePicker(props) {
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={props.selectedDate ?? new Date()}
      mode={props.mode ?? "date"}
      display={Platform.OS === "ios" ? "spinner" : "calendar"}
      onChange={(e, date) => {
        if (Platform.OS === "android") {
          props.onChange(date);
          props.onDismiss();
        } else {
          props.setSelectedDate(date);
        }
      }}
    />
  );
}

export default function DatePicker(props: any) {
  const [selectedDate, setSelectedDate] = useState(props.value);
  const { t } = useTrans();
  const color = useColorScheme();

  if (Platform.OS === "android" && props.showed) {
    return (
      <_DatePicker
        mode={props.mode}
        onChange={props.onChange}
        onDismiss={props.onDismiss}
        selectedDate={selectedDate}
      />
    );
  }

  return (
    <Dialog
      useSafeArea
      containerStyle={{ borderRadius: 20, backgroundColor: color === "light" ? "#fff" : "#393939" }}
      top={true}
      bottom={true}
      panDirection={PanningProvider.Directions.DOWN}
      visible={props.showed}
      onDismiss={props.onDismiss}
    >
      <_DatePicker
        mode={props.mode}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingBottom: 18 }}>
        <View style={{ flex: 1 }} />
        <Touchable
          style={{
            backgroundColor: "#f4f4f4",
            borderRadius: 5,
            marginRight: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={() => {
            props.onDismiss();
          }}
        >
          <Text>{t("cancel")}</Text>
        </Touchable>
        <Touchable
          style={{
            backgroundColor: "#6862a9",
            paddingVertical: 10,
            paddingHorizontal: 35,
            borderRadius: 5,
          }}
          onPress={() => {
            props.onChange(selectedDate);
            props.onDismiss();
          }}
        >
          <Text style={{ color: "white" }}>{t("confirm")}</Text>
        </Touchable>
      </View>
    </Dialog>
  );
}
