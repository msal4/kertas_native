import React from 'react';
import { View, Text } from 'react-native';
import { Touchable } from './touchable';

export default class Error extends React.Component {
  render() {
    if(this.props.isError == false) {
      return null;
    }
    return (
      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: this.props.height == undefined? 'auto': this.props.height}}>
        <Text style={{fontFamily: 'Dubai-Regular', color: this.props.color == undefined? 'white': this.props.color}}>{this.props.msg}</Text>
        <View style={{borderRadius: 5, overflow: 'hidden', marginTop: 10}}>
          <Touchable onPress={this.props.onPress}>
            <View style={{backgroundColor: '#d5d5d5', padding: 10}}>
              <Text style={{fontFamily: 'Dubai-Regular'}}>{this.props.btnText}</Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}