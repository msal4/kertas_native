import React from 'react';
import { View } from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

export default class Loading extends React.Component {
  render() {
    if(this.props.isLoading == false) {
      return null;
    }
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: this.props.height == undefined? 'auto': this.props.height}}>
        <DotIndicator color={this.props.color == undefined? 'white': this.props.color} count={3} />
      </View>
    );
  }
}