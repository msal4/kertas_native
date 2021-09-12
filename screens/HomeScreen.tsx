import * as React from "react";
import { useState } from "react";
import { View, Dimensions, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons as Icon } from "@expo/vector-icons";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { Touchable } from "../components/Touchable";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Moment from "moment";
import SelectModal from "../components/Select";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import { KText } from "../components/KText";

import { RootStackScreenProps } from "../types";
import { useScheduleQuery } from "../generated/graphql";
import dayjs_ar from "dayjs/locale/ar-iq";
import dayjs_en from "dayjs/locale/en";
import dayjs from "dayjs";
import { useTrans } from "../context/trans";

const dayjs_locals = {
  en: dayjs_en,
  ar: dayjs_ar,
};

const windowHeight = Dimensions.get("screen").height;

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
  const [selectedWeekday, setWeekDay] = useState(dayjs().day());
  const { t, locale } = useTrans();

  const currDate = dayjs().add(selectedWeekday - dayjs().day(), "day");

  return (
    <SafeAreaView style={{ backgroundColor: "#f4f4f4", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#f4f4f4" + "dd",
          paddingTop: 20,
          paddingBottom: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          width: "100%",
          zIndex: 999,
          marginTop: getStatusBarHeight(),
        }}
      >
        <View style={{ flex: 1 }}>
          <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", fontSize: 35, textAlign: "left" }}>{currDate.format("dddd")}</KText>
          <KText style={{ fontFamily: "Dubai-Regular", color: "#393939", textAlign: "left" }}>{currDate.format("D - MMMM - YYYY")}</KText>
        </View>
        <SelectModal
          data={dayjs_locals[locale].weekdays!.map((name, value) => ({ name, value }))}
          onSelect={({ value }) => {
            setWeekDay(value);
          }}
          selected={selectedWeekday}
          renderBtn={() => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 100,
                width: 50,
                height: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="calendar-outline" size={28} color="#a18cd1" />
            </View>
          )}
          initialNumToRender={7}
          height={600}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
        <Schedule weekday={selectedWeekday} />
      </View>

      <ScrollBottomSheet<string>
        componentType="ScrollView"
        snapPoints={[
          windowHeight - 427 + (Platform.OS == "ios" ? getStatusBarHeight() : -getStatusBarHeight()),
          windowHeight - 270 + (Platform.OS == "ios" ? getStatusBarHeight() : -getStatusBarHeight()),
        ]}
        initialSnapIndex={1}
        renderHandle={() => null}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "#fff", flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Touchable
                onPress={() => {
                  navigation.navigate("Assignments", { isExam: false });
                }}
              >
                <View style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", height: 150 }}>
                  <View
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderRadius: 100,
                      width: 50,
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="reader-outline" size={28} color="#a18cd1" />
                  </View>
                  <KText style={{ color: "#393939", fontSize: 18 }}>{t("assignments")}</KText>
                </View>
              </Touchable>
            </View>
            <View style={{ flex: 1 }}>
              <Touchable
                onPress={() => {
                  navigation.navigate("Assignments", { isExam: true });
                }}
              >
                <View style={{ backgroundColor: "#fafafa", justifyContent: "center", alignItems: "center", height: 150 }}>
                  <View
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderRadius: 100,
                      width: 50,
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="create-outline" size={28} color="#a18cd1" />
                  </View>
                  <KText style={{ color: "#393939", fontSize: 18 }}>{t("exams")}</KText>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Touchable
                onPress={() => {
                  navigation.navigate("CourseGrades");
                }}
              >
                <View style={{ backgroundColor: "#fafafa", justifyContent: "center", alignItems: "center", height: 150 }}>
                  <View
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderRadius: 100,
                      width: 50,
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="ios-checkmark-done-circle-outline" size={28} color="#a18cd1" />
                  </View>
                  <KText style={{ color: "#393939", fontSize: 18 }}>{t("my_marks")}</KText>
                </View>
              </Touchable>
            </View>
            <View style={{ flex: 1 }}>
              <Touchable>
                <View style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", height: 150 }}>
                  <View
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderRadius: 100,
                      width: 50,
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="people-outline" size={28} color="#a18cd1" />
                  </View>
                  <KText style={{ color: "#393939", fontSize: 18 }}>{t("attendance")}</KText>
                </View>
              </Touchable>
            </View>
          </View>
        </View>
      </ScrollBottomSheet>
    </SafeAreaView>
  );
}

function getTime(dateTime: Moment.Moment) {
  return Moment({ h: dateTime.hours(), m: dateTime.minutes() });
}

const getClassTime = (item: any) => {
  const d = new Date(item.startsAt);
  const nsTohr = item.duration / 3600000000000;
  const dh = Moment(new Date(item.startsAt)).add(nsTohr, "hours");
  const curD = new Date();
  let isNow = false;
  if (getTime(Moment(curD)).isBetween(getTime(Moment(d)), getTime(Moment(dh)))) {
    isNow = true;
  }
  return {
    timeFrom: Moment(d).format("LT"),
    timeTo: Moment(dh).format("LT"),
    isNow,
  };
};

function Schedule({ weekday }: { weekday: number }) {
  const [res, refetch] = useScheduleQuery({ variables: { weekday } });
  const { t } = useTrans();

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
        btnKText={t("اعد المحاولة")}
      />
    );
  }

  return (
    <>
      {res.data?.schedule ? (
        <FlatList
          data={res.data.schedule}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 140, paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          renderItem={({ item }) => (
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
              <View style={{ flexDirection: "row", padding: 15, backgroundColor: "#fff", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                  <View
                    style={{
                      backgroundColor: getClassTime(item).isNow == true ? "#5fc414" : "transparent",
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                    }}
                  ></View>
                </View>
                <KText style={{ fontFamily: "Dubai-Medium", color: "#393939" }}>{item.class.name}</KText>
                <View style={{ width: 1, backgroundColor: "#777", marginHorizontal: 10, height: 15 }}></View>
                <KText style={{ fontFamily: "Dubai-Regular", color: "#777", flex: 1, textAlign: "left", fontSize: 12 }} numberOfLines={1}>
                  {item.class.teacher.name}
                </KText>
                <KText style={{ fontFamily: "Dubai-Regular", color: "#393939", fontSize: 12 }}>
                  {getClassTime(item).timeFrom} - {getClassTime(item).timeTo}
                </KText>
              </View>
            </View>
          )}
        />
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#fff"} />
    </>
  );
}
