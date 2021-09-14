import * as React from "react";
import { useState } from "react";
import { View, FlatList, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons as Icon, Ionicons } from "@expo/vector-icons";
import { Touchable } from "../components/Touchable";
import Loading from "../components/Loading";
import { Error } from "../components/Error";

import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { useCourseGradesQuery, useClassesQuery } from "../generated/graphql";

export default function CourseGradesScreen({ navigation }: any) {
  const { top, bottom, right, left } = useSafeAreaInsets();
  const { t, isRTL } = useTrans();
  const [res, refetch] = useClassesQuery();

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom, flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: "#f4f4f4",
          paddingTop: 10 + top,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  <Icon name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} size={24} color="#383838" />
                </View>
              </Touchable>
              <View style={{ flex: 1 }}>
                <KText style={{ color: "#393939", textAlign: "left", fontSize: 23 }}>{t("my_marks")}</KText>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {res.error ? (
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
        ) : null}

        {res.data?.classes.edges ? (
          <FlatList
            data={res.data?.classes.edges}
            keyExtractor={(item) => item?.node?.id ?? ""}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }} />}
            renderItem={({ item }) => <ClassItem item={item} />}
          />
        ) : null}
        <Loading isLoading={res.fetching} height={500} color={"#919191"} />
      </View>
    </View>
  );
}

function ClassItem({ item }) {
  const [showGrades, setShowGrades] = useState(false);

  return (
    <Touchable
      onPress={() => {
        setShowGrades(!showGrades);
      }}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <KText style={{ color: "#000", textAlign: "left", marginRight: 10 }}>{item?.node?.name}</KText>
          <KText style={{ color: "#919191", textAlign: "left", fontSize: 13 }} numberOfLines={1}>
            {item?.node?.teacher.name}
          </KText>
          <View style={{ flex: 1 }} />
          <Ionicons name={showGrades ? "chevron-up" : "chevron-down"} color="#393939" />
        </View>
        {showGrades ? <Grades classID={item?.node?.id} /> : null}
      </View>
    </Touchable>
  );
}

function Grades(props) {
  const { t } = useTrans();
  const [res, refetch] = useCourseGradesQuery({
    variables: {
      classID: props.classID,
    },
  });

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
    <View>
      {res.data?.courseGrades.edges
        ? res.data?.courseGrades.edges?.map((item) => (
            <View key={item?.node?.id} style={{ marginTop: 10 }}>
              <KText style={{ color: "#919191", textAlign: "left" }}>
                {item?.node?.course === "FIRST" ? t("first_course") : t("second_course")}
              </KText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#f4f4f4",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("a")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.activityFirst}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("w")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.writtenFirst}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("a")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.activitySecond}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("w")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.writtenSecond}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("s")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.activityFirst + item?.node?.writtenFirst + item?.node?.activitySecond + item?.node?.writtenSecond}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("course_final")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.courseFinal}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>{t("s")}</KText>
                  <KText
                    style={{
                      color: "#000",
                      fontSize: 12,
                      textAlign: "center",
                      margin: 10,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    {item?.node?.activityFirst +
                      item?.node?.writtenFirst +
                      item?.node?.activitySecond +
                      item?.node?.writtenSecond +
                      item?.node?.courseFinal}
                  </KText>
                </View>
              </View>
            </View>
          ))
        : null}
    </View>
  );
}
