import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, FlatList, ListRenderItemInfo } from "react-native";
import Modal from "react-native-modal";
import { Touchable } from "./Touchable";

type Item = { name: string; value: number | string };

interface SelectModalProps {
  selected: number | string;
  data: Array<Item>;
  onSelect: (data: Item) => void;
  height?: string | number;
  initialNumToRender?: number;
  renderBtn: (name: string) => ReactNode;
}

export default function SelectModal(props: SelectModalProps) {
  const [showed, setShowed] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    for (let i = 0; i < props.data.length; i++) {
      if (props.selected == props.data[i].value) {
        setSelectedTitle(props.data[i].name);
      }
    }
  });

  const renderItem = ({ item }: ListRenderItemInfo<Item>) => {
    return (
      <Touchable
        style={{ borderRadius: 20, overflow: "hidden", marginBottom: 15 }}
        onPress={() => {
          setSelectedTitle(item.name);
          setShowed(false);
          props.onSelect(item);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 25,
            paddingVertical: 15,
            backgroundColor: props.selected === item.value ? "#6862a9" : "#fff",
          }}
        >
          <Text
            style={{
              fontFamily: "Dubai-Regular",
              color: props.selected === item.value ? "#fff" : "#919191",
            }}
          >
            {item.name}
          </Text>
        </View>
      </Touchable>
    );
  };

  return (
    <>
      <Modal
        isVisible={showed}
        onBackButtonPress={() => setShowed(false)}
        onSwipeComplete={() => setShowed(false)}
        onBackdropPress={() => setShowed(false)}
        style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: "transperant",
            borderRadius: 5,
            maxHeight: props.height == undefined ? 400 : props.height,
            width: "75%",
          }}
        >
          <FlatList
            data={props.data}
            keyExtractor={(item, index) => index + item.name + item.value}
            renderItem={renderItem}
            initialNumToRender={props.initialNumToRender ? props.initialNumToRender : 10}
            showsVerticalScrollIndicator={false}
            bounces={false}
          />
        </View>
      </Modal>
      <Touchable onPress={() => setShowed(true)}>{props.renderBtn(selectedTitle)}</Touchable>
    </>
  );
}
