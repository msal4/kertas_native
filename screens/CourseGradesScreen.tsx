import * as React from "react";
import { useState } from "react";
import { View, FlatList, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons as Icon } from "@expo/vector-icons";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import Loading from "../components/Loading";
import { Error } from "../components/Error";

import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { useCourseGradesQuery, useClassesQuery } from "../generated/graphql";

export default function CourseGradesScreen({ navigation, screenProps, route }: any) {
  const { top, bottom, right, left } = useSafeAreaInsets();
  const { t, locale, isRTL } = useTrans();
  const [res, refetch] = useClassesQuery();

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom, flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: "#f4f4f4",
          paddingTop: 20 + top,
          paddingBottom: 0
        }}
      >
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
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
                  <Icon name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} size={24} color="#393939" />
                </View>
              </Touchable>
              <View style={{ flex: 1 }}>
                <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", fontSize: 20, textAlign: "left", marginHorizontal: 10 }}>
                  {t("my_marks")}
                </KText>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: "#fff", flex: 1 }}>

        {res.error?
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
        : null}

        {res.data?.classes.edges?
        <FlatList
          data={res.data?.classes.edges}
          keyExtractor={(item, index) => index + "a"}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RenderClass item={item} />
          )}
        />
        : null}
        <Loading isLoading={res.fetching} height={500} color={"#919191"} />
      </View>
    </View>
  );
}

function RenderClass({ item }) {
  const [showGrades, setShowGrades] = useState(false);

  return (
    <Touchable onPress={() => {
      setShowGrades(!showGrades);
    }}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
        <View style={{ flex: 1 }}>
          <KText style={{ fontFamily: "Dubai-Bold", color: "#000", textAlign: "left" }}>
            {item?.node?.name}
          </KText>
          <KText style={{ color: "#919191", textAlign: "left", marginTop: 10 }} numberOfLines={1}>
            {item?.node?.teacher.name}
          </KText>
        </View>
        {showGrades?
        <Grades classID={item?.node?.id} />
        : null}
      </View>
    </Touchable>
  )
}

function Grades(props) {
  const { t } = useTrans();
  const [res, refetch] = useCourseGradesQuery({
    variables: {
      classID: props.classID
    }
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
    <View style={{ backgroundColor: '#fff' }}>
      {res.data?.courseGrades.edges? res.data?.courseGrades.edges?.map((item, index) => (
        <View>
          <KText style={{ color: "#919191", textAlign: "left" }}>{item?.node?.course === 'FIRST'? t("first_course"): t("second_course")}</KText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f4f4f4', borderRadius: 10, marginBottom: 10 }}>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("a")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.activityFirst}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("w")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.writtenFirst}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("a")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.activitySecond}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("w")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.writtenSecond}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("s")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.activityFirst + item?.node?.writtenFirst + item?.node?.activitySecond + item?.node?.writtenSecond}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("course_final")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.courseFinal}</KText>
            </View>
            <View>
              <KText style={{ color: '#393939', textAlign: 'center' }}>{t("s")}</KText>
              <KText style={{ color: '#000', fontSize: 12, textAlign: 'center', margin: 10, paddingHorizontal: 5, borderRadius: 5, overflow: 'hidden' }}>{item?.node?.activityFirst + item?.node?.writtenFirst + item?.node?.activitySecond + item?.node?.writtenSecond + item?.node?.courseFinal}</KText>
            </View>
          </View>
        </View>
      )): null}

      <Loading isLoading={res.fetching} height={"100%"} color={"#919191"} />
    </View>
  )
}