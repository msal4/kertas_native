import * as React from "react";
import { useState } from "react";
import { Text, View, FlatList, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import dayjs from "dayjs";
import { Dialog } from "react-native-ui-lib";
import DatePicker from "../components/DatePicker";
import CalendarIcon from "../assets/icons/Calendar.svg";

import { useAssignmentsQuery } from "../generated/graphql";

export default function AssignmentsScreen({ navigation, screenProps }: any) {
  const [selectedWeekday, setWeekDay] = useState(dayjs().day());
  const [showDate, setShowDate] = useState(false);
  const { top, bottom, right, left } = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom, flex: 1, backgroundColor: "#fff" }}>
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
          <View style={{ flexDirection: "row" }}>
            <Touchable
              onPress={() => {
                navigation.goBack();
              }}
            >
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
              <Text style={{ fontFamily: "Dubai-Medium", color: "#fff", fontSize: 28, textAlign: "left", marginHorizontal: 10 }}>
                الواجبات
              </Text>
              <Text style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left" }}>
                {dayjs(selectedDate).locale("ar").format("D - MMMM - YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <Touchable
          onPress={() => {
            setShowDate(true);
          }}
        >
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
            <CalendarIcon name="Calendar" color="#fff" width={28} height={28} />
          </View>
        </Touchable>
      </View>

      <DatePicker
        showed={showDate}
        value={selectedDate}
        onDismiss={() => {
          setShowDate(false);
        }}
        onChange={(date) => {
          setSelectedDate(date);
        }}
      />

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Schedule selectedDate={selectedDate} />
      </View>
    </View>
  );
}

function Schedule({ selectedDate }: { selectedDate: Date }) {
  const [res, refetch] = useAssignmentsQuery({
    variables: {
      where: {
        dueDateGTE: dayjs(selectedDate).set("hour", 3).set("minute", 0).set("second", 0).toDate(),
        dueDateLT: dayjs(selectedDate).add(1, "day").set("hour", 3).set("minute", 0).set("second", 0).toDate(),
      },
    },
  });
  const [showDialog, setShowDialog] = useState(false);

  console.log(res, res.fetching);

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
        panDirection={"UP"}
        visible={showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
      >
        <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10 }}>
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
            <Touchable
              onPress={() => {
                setShowDialog(true);
              }}
            >
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
