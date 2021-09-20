import React, { FC } from "react";
import { Platform, TouchableOpacityProps } from "react-native";

import { TouchableOpacity } from "react-native";

import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";
import { GenericTouchableProps } from "react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable";

export const Touchable: FC<TouchableOpacityProps & GenericTouchableProps> = (props) => {
  if (Platform.OS === "android") {
    return <RNGHTouchableOpacity {...props} />;
  }

  return <TouchableOpacity {...props} />;
};
