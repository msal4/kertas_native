import * as React from "react";
import { useState } from "react";
import { Text, View, Dimensions, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { Touchable } from "../components/Touchable";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Moment from "moment";
import SelectModal from "../components/Select";
import Loading from "../components/Loading";
import { Error } from "../components/Error";

import { RootStackScreenProps } from "../types";
import { useScheduleQuery } from "../generated/graphql";
import { clearTokens } from "../util/auth";

const windowHeight = Dimensions.get("screen").height;

const getCurDate = (wd?: number) => {
  const weekDays = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت"];
  const months = [
    "كانون الثاني",
    "شباط",
    "آذار",
    "نيسان",
    "آيار",
    "حزيران",
    "تموز",
    "آب",
    "آيلول",
    "تشرين الاول",
    "تشرين الثاني",
    "كانون الأول",
  ];

  let d = wd == null || wd == undefined ? Moment() : Moment().day(wd < 6 ? wd + 7 : wd);

  return {
    dayName: weekDays[d.day()],
    day: d.date(),
    dayOfWeek: d.day() < 6 ? d.day() + 7 : d.day(),
    monthName: months[d.month()],
    month: d.month() + 1,
    year: d.year(),
  };
};

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
  const [selectedWeekday, setWeekDay] = useState(getCurDate().dayOfWeek % 6);

  return (
    <SafeAreaView style={{ backgroundColor: "#919191", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#919191" + "dd",
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
          <Text style={{ fontFamily: "Dubai-Medium", color: "#fff", fontSize: 35, textAlign: "left" }}>
            {t(getCurDate(selectedWeekday).dayName)}
          </Text>
          <Text style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left" }}>
            {getCurDate(selectedWeekday).day} - {getCurDate(selectedWeekday).monthName} - {getCurDate(selectedWeekday).year}
          </Text>
        </View>
        <SelectModal
          data={[
            { name: "السبت", value: 6 },
            { name: "الاحد", value: 0 },
            { name: "الاثنين", value: 1 },
            { name: "الثلاثاء", value: 2 },
            { name: "الاربعاء", value: 3 },
            { name: "الخميس", value: 4 },
            { name: "الجمعة", value: 5 },
          ]}
          onSelect={async (name, value, item) => {
            setWeekDay(value);
          }}
          selected={selectedWeekday}
          renderBtn={(selected) => (
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
          )}
          initialNumToRender={7}
          height={600}
        />
      </View>

      <Schedule weekday={selectedWeekday} />

      <ScrollBottomSheet<string>
        componentType="ScrollView"
        snapPoints={[
          windowHeight - 568 + (Platform.OS == "ios" ? getStatusBarHeight() : 0),
          windowHeight - 270 + (Platform.OS == "ios" ? getStatusBarHeight() : 0),
        ]}
        initialSnapIndex={1}
        renderHandle={() => null}
      >
        <View style={{ backgroundColor: "#fff", flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Touchable
                onPress={() => {
                  navigation.navigate("Assignments");
                }}
              >
                <View style={{ backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>مواد الدراسة</Text>
                </View>
              </Touchable>
            </View>
            <View style={{ flex: 1 }}>
              <Touchable>
                <View style={{ backgroundColor: "#d5d5d5", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>ملفاتي</Text>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Touchable
                onPress={() => {
                  navigation.navigate("Assignments");
                }}
              >
                <View style={{ backgroundColor: "#d5d5d5", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>الواجبات</Text>
                </View>
              </Touchable>
            </View>
            <View style={{ flex: 1 }}>
              <Touchable>
                <View style={{ backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>الامتحانات</Text>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Touchable>
                <View style={{ backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>الدرجات</Text>
                </View>
              </Touchable>
            </View>
            <View style={{ flex: 1 }}>
              <Touchable>
                <View style={{ backgroundColor: "#d5d5d5", justifyContent: "center", alignItems: "center", height: 150 }}>
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
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#9a9a9a", fontSize: 18 }}>الحضور</Text>
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

  console.log(res.error, res.fetching);

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
      {res.data?.schedule ? (
        <FlatList
          data={res.data.schedule}
          keyExtractor={(item, index) => index + "a"}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 140, paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ borderRadius: 20, overflow: "hidden", marginBottom: 15 }}>
              <View style={{ flexDirection: "row", padding: 15, backgroundColor: "#e4e4e4" }}>
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
                <Text style={{ fontFamily: "Dubai-Bold", color: "#919191" }}>{item.class.name}</Text>
                <View style={{ width: 1, backgroundColor: "#9a9a9a", marginHorizontal: 10 }}></View>
                <Text style={{ fontFamily: "Dubai-Regular", color: "#9a9a9a", flex: 1, textAlign: "left" }}>{item.class.teacher.name}</Text>
                <Text style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
                  {getClassTime(item).timeFrom} - {getClassTime(item).timeTo}
                </Text>
              </View>
            </View>
          )}
        />
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#fff"} />
    </>
  );
}

// TODO: remove after implementing localization.
function t(term: string): string {
  return term;
}
