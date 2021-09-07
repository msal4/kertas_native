import React from "react";
import { View, Text } from "react-native";
import { Touchable } from "./Touchable";

interface ErrorProps {
  isError: boolean;
  height?: string | number;
  msg?: string;
  onPress?: () => void;
  btnText?: string;
  color?: string;
}

export function Error({
  isError = false,
  color = "white",
  height = "auto",
  msg = "Semething went wrong",
  btnText = "Retry",
  onPress,
}: ErrorProps) {
  if (!isError) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height,
        flex: height === '100%'? 1: 'none'
      }}
    >
      <Text style={{ fontFamily: "Dubai-Regular", color }}>{msg}</Text>
      <View style={{ borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
        <Touchable onPress={onPress}>
          <View style={{ backgroundColor: "#d5d5d5", padding: 10 }}>
            <Text style={{ fontFamily: "Dubai-Regular" }}>{btnText}</Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
}
