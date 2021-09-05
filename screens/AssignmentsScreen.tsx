import * as React from "react";
import { useState } from "react";
import { Text, View, FlatList, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import SelectModal from "../components/Select";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import dayjs from "dayjs";
import { weekdays } from "dayjs/locale/ar";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dialog } from 'react-native-ui-lib';

import { useAssignmentsQuery } from "../generated/graphql";

export default function AssignmentsScreen({ navigation,  screenProps }: any) {
  const [selectedWeekday, setWeekDay] = useState(dayjs().day());
  const [showDate, setShowDate] = useState(false);
  const { top, bottom, right, left } = useSafeAreaInsets();

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom, flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          backgroundColor: "#919191",
          paddingTop: 20 + top,
          paddingBottom: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{flexDirection: 'row'}}>
            <Touchable onPress={() => {
              navigation.goBack();
            }}>
              <View
                style={{
                  borderRadius: 100,
                  width: 50,
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="chevron-right" size={24} color="#fff" />
              </View>
            </Touchable>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Dubai-Medium", color: "#fff", fontSize: 35, textAlign: "left", marginHorizontal: 10 }}>
                الواجبات
              </Text>
              <Text style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left" }}>
                {dayjs().locale("ar").format("D - MMMM - YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <Touchable onPress={() => {
          setShowDate(true);
        }}>
          <View
            style={{
              backgroundColor: "#bcbcbc",
              borderRadius: 100,
              width: 50,
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="calendar" size={28} color="#fff" />
          </View>
        </Touchable>
      </View>

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {showDate ?
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={"date"}
          display={Platform.OS === "ios"? "spinner": "calendar"}
          onChange={() => {}}
        />
        : null}
        <Schedule weekday={selectedWeekday} />
      </View>
    </View>
  );
}

function Schedule() {
  const [res, refetch] = useAssignmentsQuery();
  const [showDialog, setShowDialog] = useState(false);

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        height={500}
        color={"#fff"}
        msg={t("حدث خطأ يرجى اعادة المحاولة")}
        btnText={t("اعد المحاولة")}
      />
    );
  }

  return (
    <>
      <Dialog
        migrate
        useSafeArea
        bottom={true}
        height={300}
        panDirection={'UP'}
        visible={showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
      >
        <View style={{ backgroundColor: '#fff', flex: 1, borderRadius: 20, overflow: 'hidden', padding: 10 }}>
          <Text>test</Text>
        </View>
      </Dialog>
      {res.data?.assignments.edges ? (
        <FlatList
          data={res.data?.assignments.edges}
          keyExtractor={(item, index) => index + "a"}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Touchable onPress={() => {
              setShowDialog(true);
            }}>
              <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#000", textAlign: "left" }}>
                    {item?.node?.class.name} - {item?.node.name}
                  </Text>
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#919191", textAlign: "left" }} numberOfLines={1}>
                    {item?.node?.description}
                  </Text>
                </View>
                <Text style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>{Moment(item?.node?.dueDate).format("Y-MM-DD")}</Text>
              </View>
            </Touchable>
          )}
        />
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#919191"} />
    </>
  );
}

function t(term: string): string {
  return term;
}
