import { Platform } from "react-native"


import { TouchableNativeFeedback, TouchableOpacity, TouchableHighlight } from "react-native"
import React from "react"

export const Touchable = (props) => {
  return Platform.OS === 'android'
    ? <TouchableNativeFeedback disabled={props.disabled == undefined? false: props.disabled} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.1)')} onPress={props.onPress} onPressIn={props.onPressIn} onPressOut={props.onPressOut}>{props.children}</TouchableNativeFeedback>
    : <TouchableOpacity disabled={props.disabled == undefined? false: props.disabled} activeOpacity={0.6} style={props.style} onPress={props.onPress} onPressIn={props.onPressIn} onPressOut={props.onPressOut}>{props.children}</TouchableOpacity>
}