import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import { Touchable } from '../components/touchable';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { RootStackScreenProps } from "../types";
import { Button, TextField, Toast } from "react-native-ui-lib";
import { useLoginMutation } from "../generated/graphql";
import { setTokens } from "../util/auth";

const windowHeight = Dimensions.get('screen').height;

export default function Home({ navigation, screenProps }: RootStackScreenProps<"Home">) {

  const t = screenProps.t;

  const getCurDate = () => {
    const weekDays = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة'];
    const months = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'آيار', 'حزيران', 'تموز', 'آب', 'آيلول', 'تشرين الاول', 'تشرين الثاني', 'كانون الأول'];
    const d = new Date();
    return {
      dayName: weekDays[d.getDay()],
      day: d.getDate(),
      monthName: months[d.getMonth()],
      month: d.getMonth()+1,
      year: d.getFullYear()
    };
  }

  return (
    <SafeAreaView style={{backgroundColor: '#919191', flex: 1}}>

      <View style={{backgroundColor: 'rgba(145, 145, 145, 0.85)', paddingTop: 20, paddingBottom: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', position: 'absolute', width: '100%', zIndex: 999, marginTop: getStatusBarHeight()}}>
        <View style={{flex: 1}}>
          <Text style={{fontFamily: 'Dubai-Medium', color: '#fff', fontSize: 35, textAlign: 'left'}}>{t(getCurDate().dayName)}</Text>
          <Text style={{fontFamily: 'Dubai-Regular', color: '#fff', textAlign: 'left'}}>{getCurDate().day} - {getCurDate().monthName} - {getCurDate().year}</Text>
        </View>
        <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="calendar" size={28} color="#fff" />
        </View>
      </View>

      <FlatList
        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        keyExtractor={(item, index) => index+'a'}
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 140, paddingBottom: 250}}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={{borderRadius: 20, overflow: 'hidden', marginBottom: 15}}>
            <Touchable onPress={() => {
              screenProps.setLocale('en');
            }}>
              <View style={{flexDirection: 'row', padding: 15, backgroundColor: '#e4e4e4'}}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 10}}>
                  <View style={{backgroundColor: '#5fc414', width: 10, height: 10, borderRadius: 100}}></View>
                </View>
                <Text style={{fontFamily: 'Dubai-Bold', color: '#919191'}}>رياضيات</Text>
                <View style={{width: 1, backgroundColor: '#9a9a9a', marginHorizontal: 10}}></View>
                <Text style={{fontFamily: 'Dubai-Regular', color: '#9a9a9a', flex: 1, textAlign: 'left'}}>أ. اياد</Text>
                <Text style={{fontFamily: 'Dubai-Regular', color: '#919191'}}>09:00 - 08:00</Text>
              </View>
            </Touchable>
          </View>
        )}
      />

      <ScrollBottomSheet<string>
        componentType="ScrollView"
        snapPoints={[windowHeight - 568 + (Platform.OS == 'ios'? getStatusBarHeight(): 0), windowHeight - 270 + (Platform.OS == 'ios'? getStatusBarHeight(): 0)]}
        initialSnapIndex={1}
        renderHandle={() => (
          null
        )}
      >
        <View style={{backgroundColor: '#fff', flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>مواد الدراسة</Text>
                </View>
              </Touchable>
            </View>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#d5d5d5', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>ملفاتي</Text>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#d5d5d5', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>الواجبات</Text>
                </View>
              </Touchable>
            </View>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>الامتحانات</Text>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>الدرجات</Text>
                </View>
              </Touchable>
            </View>
            <View style={{flex: 1}}>
              <Touchable>
                <View style={{backgroundColor: '#d5d5d5', justifyContent: 'center', alignItems: 'center', height: 150}}>
                  <View style={{backgroundColor: '#bcbcbc', borderRadius: 100, width: 50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="calendar" size={28} color="#fff" />
                  </View>
                  <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 18}}>الحضور</Text>
                </View>
              </Touchable>
            </View>
          </View>
        </View>
      </ScrollBottomSheet>

      <View style={{backgroundColor: '#f4f4f4', position: 'absolute', width: '100%', bottom: 0, flexDirection: 'row', paddingBottom: Platform.OS == 'ios'? 15: 0}}>
        <View style={{flex: 1}}>
          <Touchable>
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
              <Icon name="calendar" size={28} color="#8e8e8e" />
              <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 14}}>الرئيسية</Text>
            </View>
          </Touchable>
        </View>
        <View style={{flex: 1}}>
          <Touchable>
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
              <Icon name="calendar" size={28} color="#8e8e8e" />
              <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 14}}>المحادثات</Text>
            </View>
          </Touchable>
          <View style={{backgroundColor: '#f01640', width: 13, height: 13, borderRadius: 100, position: 'absolute', marginLeft: 30, marginTop: 10}}></View>
        </View>
        <View style={{flex: 1}}>
          <Touchable>
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
              <Icon name="calendar" size={28} color="#8e8e8e" />
              <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 14}}>الاشعارات</Text>
            </View>
          </Touchable>
        </View>
        <View style={{flex: 1}}>
          <Touchable>
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
              <Icon name="calendar" size={28} color="#8e8e8e" />
              <Text style={{fontFamily: 'Dubai-Bold', color: '#9a9a9a', fontSize: 14}}>معلوماتي</Text>
            </View>
          </Touchable>
        </View>
      </View>

    </SafeAreaView>
  );
}
