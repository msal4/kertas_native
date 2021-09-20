import React from "react";
import { View, Text, ViewProps } from "react-native";
import { useTrans } from "../context/trans";
import { Touchable } from "./Touchable";

interface ErrorProps {
  isError?: boolean;
  msg?: string;
  onPress?: () => void;
  btnText?: string;
  color?: string;
}

export const Error: React.FC<ViewProps & ErrorProps> = ({ isError = true, color = "#9a9a9a", msg, btnText, onPress, ...props }) => {
  const { t } = useTrans();

  if (!msg) {
    msg = t("something_went_wrong");
  }
  if (!btnText) {
    btnText = t("retry");
  }

  if (!isError) {
    return null;
  }

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        props.style,
      ]}
    >
      <Text style={{ fontFamily: "Dubai-Regular", color }}>{msg}</Text>
      <View style={{ borderRadius: 8, overflow: "hidden", marginTop: 10 }}>
        <Touchable onPress={onPress}>
          <View style={{ backgroundColor: "#d5d5d5", padding: 10 }}>
            <Text style={{ fontFamily: "Dubai-Regular" }}>{btnText}</Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
};
