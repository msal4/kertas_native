import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { memo, useRef, useState } from "react";
import { FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DatePicker from "../components/DatePicker";
import { KText } from "../components/KText";
import { RootStackScreenProps } from "../types";
import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import { AttendanceFragment, AttendanceState, useAttendancesQuery } from "../generated/graphql";
import { Error } from "../components/Error";
import { useNavigation } from "@react-navigation/native";

export function AttendanceScreen({ navigation }: RootStackScreenProps<"Attendance">) {
  const { t, locale, isRTL } = useTrans();
  const { top, right, left } = useSafeAreaInsets();
  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          paddingLeft: left,
          paddingRight: right,
          backgroundColor: "#f4f4f4",
          paddingTop: 10 + top,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}>
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
                <Ionicons name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} size={24} color="#393939" />
              </View>
            </Touchable>
            <KText
              style={{
                color: "#393939",
                fontSize: 23,
                textAlign: "left",
              }}
            >
              {t("attendance")}
            </KText>
            {selectedDate ? (
              <Touchable
                style={{
                  flexDirection: "row",
                  borderRadius: 100,
                  overflow: "hidden",
                  backgroundColor: "#a18cd1",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  marginLeft: 5,
                }}
                onPress={() => {
                  setSelectedDate(undefined);
                }}
              >
                <KText style={{ fontSize: 10, color: "#fff", textAlign: "left" }}>
                  {selectedDate ? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY") : ""}
                </KText>
                <Ionicons style={{ paddingLeft: 10 }} name="close" size={12} color="#fff" />
              </Touchable>
            ) : null}
          </View>
        </View>
        <Touchable
          onPress={() => {
            setShowDate(true);
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 100,
              width: 50,
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <Ionicons name="calendar-outline" size={28} color="#a18cd1" />
          </View>
        </Touchable>
      </View>

      <DatePicker
        showed={showDate}
        value={selectedDate}
        onDismiss={() => {
          setShowDate(false);
        }}
        onChange={(date: any) => {
          setSelectedDate(date);
        }}
      />

      <AttendanceList date={selectedDate ?? new Date()} />
    </>
  );
}

function AttendanceList({ date }: { date: Date }) {
  const d = dayjs(dayjs(date).format("YYYY-MM-DD"));

  const after = useRef<any>();
  const [res, refetch] = useAttendancesQuery({
    variables: { after: after.current, where: { dateGT: dayjs(d).toDate(), dateLT: dayjs(date).add(1, "day").toDate() } },
  });
  const { bottom, right, left } = useSafeAreaInsets();

  return (
    <>
      <Error isError={!!res.error} onPress={refetch} />
      {res.data?.attendances ? (
        <FlatList
          ItemSeparatorComponent={() => <View style={{ margin: 15, borderColor: "#39393922", borderWidth: 0.5 }} />}
          style={{
            backgroundColor: "#fff",
          }}
          contentContainerStyle={{
            paddingBottom: bottom + 20,
            paddingRight: right + 20,
            paddingLeft: left + 20,
            paddingTop: 20,
          }}
          data={res.data.attendances.edges}
          renderItem={({ item }) => <AttendanceItem item={item?.node!} />}
          keyExtractor={(item) => item?.node?.id ?? ""}
          onEndReached={() => {
            if (!res.fetching && res?.data?.attendances?.pageInfo.hasNextPage) {
              after.current = res?.data?.attendances?.pageInfo.endCursor;
            }
          }}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </>
  );
}

function getAttendanceStateColor(state: AttendanceState) {
  switch (state) {
    case AttendanceState.Sick:
      return "#EB92BE";
    case AttendanceState.Absent:
      return "#E05D5D";
    case AttendanceState.Present:
      return "#95DAC1";
    default:
      return "#FFC069";
  }
}

const AttendanceItem = memo(function ({ item }: { item: AttendanceFragment }) {
  const { t } = useTrans();
  const color = getAttendanceStateColor(item.state);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", justifyContent: "space-between" }}
      onPress={() => {
        navigation.navigate("Conversation", { groupID: item.class.group.id });
      }}
    >
      <KText style={{ color: "#393939" }}>{item.class.name}</KText>
      <KText style={{ color }}>{t(item.state.toLowerCase())}</KText>
    </TouchableOpacity>
  );
});
