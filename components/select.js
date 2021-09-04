import React, { Component } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback } from 'react-native';
import Modal from "react-native-modal";
import { Touchable } from '../components/touchable';

export default class SelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showed: false,
      selectedTitle: ''
    };
  }

  componentDidMount() {
    for (let i = 0; i < this.props.data.length; i++) {
      if(this.props.selected == this.props.data[i].value){
        this.setState({ selectedTitle: this.props.data[i].name })
      }
    }
  }

  renderItem = ({item, index}) => {
    return (
      <View style={{borderRadius: 20, overflow: 'hidden', marginBottom: 15}}>
        <Touchable onPress={() => {
          this.setState({ selectedTitle: item.name, showed: false }, () => {
            this.props.onSelect(item.name, item.value, item);
          })
        }}>
          <View style={{flexDirection: 'row', padding: 15, backgroundColor: '#e4e4e4'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 10}}>
              <View style={{backgroundColor: this.props.selected == item.value? '#5fc414': 'transparent', width: 10, height: 10, borderRadius: 100}}></View>
            </View>
            <Text style={{fontFamily: 'Dubai-Bold', color: '#919191'}}>{item.name}</Text>
          </View>
        </Touchable>
      </View>
    )
  }

  render() {
    return (
      <>
      <Modal
        isVisible={this.state.showed}
        onBackButtonPress={() => this.setState({ showed: false })}
        onSwipeComplete={() => this.setState({ showed: false })}
        onBackdropPress={() => this.setState({ showed: false })}
        style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{backgroundColor: 'transperant', borderRadius: 5, maxHeight: this.props.height == undefined? 400: this.props.height, width: '75%'}}>
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => index+'a'}
            renderItem={this.renderItem}
            initialNumToRender={this.props.initialNumToRender != undefined? this.props.initialNumToRender: 10}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
      <Touchable onPress={() => this.setState({ showed: true })}>
        {this.props.renderBtn(this.state.selectedTitle)}
      </Touchable>
      </>
    )
  }
}