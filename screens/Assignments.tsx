import * as React from "react";
import { useState } from "react";
import { Text, View, FlatList, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import SelectModal from "../components/Select";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import dayjs from "dayjs";
import { weekdays } from "dayjs/locale/ar";

import { useAssignmentsQuery } from "../generated/graphql";

export default function Assignments({ screenProps }: any) {
  const [selectedWeekday, setWeekDay] = useState(dayjs().day());
  const { top, bottom, right, left } = useSafeAreaInsets();

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom }}>
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
          <Text style={{ fontFamily: "Dubai-Medium", color: "#fff", fontSize: 35, textAlign: "left" }}>
            {dayjs().locale("ar").format("dddd")}
          </Text>
          <Text style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left" }}>
            {dayjs().locale("ar").format("D - MMMM - YYYY")}
          </Text>
        </View>
        <SelectModal
          data={weekdays.map((d, idx) => ({ name: d, value: idx }))}
          onSelect={async (name, value) => {
            setWeekDay(value);
          }}
          selected={selectedWeekday}
          screenProps={screenProps}
          renderBtn={() => (
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
    </View>
  );
}

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
          renderItem={({ item }) => (
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
