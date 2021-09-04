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
      <TouchableNativeFeedback onPress={() => {
        this.setState({ selectedTitle: item.name, showed: false }, () => {
          this.props.onSelect(item.name, item.value, item);
        })
      }}>
        <View style={{padding: 15, backgroundColor: this.props.selected == item.value? 'rgba(0,0,0,0.15)': 'transparent'}}>
          <Text>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
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
        <View style={{backgroundColor: '#fff', borderRadius: 5, maxHeight: 400, width: '75%'}}>
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => index+'a'}
            renderItem={this.renderItem}
            initialNumToRender={this.props.initialNumToRender != undefined? this.props.initialNumToRender: 10}
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