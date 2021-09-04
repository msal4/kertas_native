import * as React from "react";
import { useState } from "react";
import { Text, View, Dimensions, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import SelectModal from "../components/Select";
import Loading from "../components/Loading";
import { Error } from "../components/Error";

import { RootStackScreenProps } from "../types";
import { useAssignmentsQuery } from "../generated/graphql";

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

export default function Assignments({ navigation, screenProps }: RootStackScreenProps<"Assignments">) {
  const [selectedWeekday, setWeekDay] = useState(getCurDate().dayOfWeek);

  const t = screenProps.t;

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#919191",
          paddingTop: 20,
          paddingBottom: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
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
          screenProps={screenProps}
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

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Schedule weekday={selectedWeekday} />
      </View>
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

function Schedule() {
  const [res, refetch] = useAssignmentsQuery();

  console.log(res);

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
      {res.data?.assignments.edges ? (
        <FlatList
          data={res.data?.assignments.edges}
          keyExtractor={(item, index) => index + "a"}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Touchable>
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
      <Loading isLoading={res.fetching} height={500} color={"#fff"} />
    </>
  );
}

function t(term: string): string {
  return term;
}
