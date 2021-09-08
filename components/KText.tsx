import React, { FC } from "react";
import { TextProps, Text } from "react-native";

export const KText: FC<TextProps> = (props) => {
  return <Text {...props} style={[{ fontFamily: "Dubai-Regular", fontSize: 15, color: "#9a9a9a" }, props.style]} />;
};
