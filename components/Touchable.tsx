import React, { FC } from "react";
import { Platform, TouchableNativeFeedbackProps, TouchableOpacityProps } from "react-native";

import { TouchableNativeFeedback, TouchableOpacity } from "react-native";

export const Touchable: FC<TouchableOpacityProps & TouchableNativeFeedbackProps> = (props) => {
  return Platform.OS === "android" ? (
    <TouchableNativeFeedback
      disabled={props.disabled == undefined ? false : props.disabled}
      background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.1)", false)}
      {...props}
    >
      {props.children}
    </TouchableNativeFeedback>
  ) : (
    <TouchableOpacity disabled={props.disabled == undefined ? false : props.disabled} activeOpacity={0.6} {...props}>
      {props.children}
    </TouchableOpacity>
  );
};
