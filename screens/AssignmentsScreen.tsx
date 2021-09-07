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
import FilesIcon from '../assets/icons/Files.svg';

import { useAssignmentsQuery, useAssignmentsSubmissionQuery } from "../generated/graphql";
import { useTrans } from "../context/trans";

export default function AssignmentsScreen({ navigation, screenProps }: any) {
  const [showDate, setShowDate] = useState(false);
  const { top, bottom, right, left } = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(null);
  const { t, locale } = useTrans();

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
                <Icon name={locale === "ar" ? "chevron-right" : "chevron-left"} size={24} color="#fff" />
              </View>
            </Touchable>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Dubai-Medium", color: "#fff", fontSize: 28, textAlign: "left", marginHorizontal: 10 }}>
                {t("assignments")}
              </Text>
              <View style={{ flexDirection: 'row', opacity: selectedDate? 1: 0 }}>
                <View style={{ flexDirection: 'row', borderRadius: 100, overflow: 'hidden', backgroundColor: '#bcbcbc', alignItems: 'center' }}>
                  <Text style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left", paddingHorizontal: 10 }}>
                    {selectedDate? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY"): ''}
                  </Text>
                  <View style={{ borderRadius: 100, overflow: 'hidden' }}>
                    <Touchable onPress={() => {
                      setSelectedDate(null);
                    }}>
                      <View style={{ width: 30, height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={"times"} size={12} color="#fff" />
                      </View>
                    </Touchable>
                  </View>
                </View>
              </View>
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
            <CalendarIcon color="#fff" width={28} height={28} />
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
        <Assignment selectedDate={selectedDate} />
      </View>
    </View>
  );
}

function Assignment({ selectedDate }: { selectedDate: Date }) {
  const [curDate] = useState(new Date());
  const [res, refetch] = useAssignmentsQuery({
    variables: {
      where: {
        dueDateGTE: dayjs(selectedDate?? curDate).set("hour", 3).set("minute", 0).set("second", 0).toDate(),
        dueDateLT: selectedDate? dayjs(selectedDate).add(1, "day").set("hour", 3).set("minute", 0).set("second", 0).toDate(): null,
      },
    },
  });
  const { t, locale } = useTrans();

  const [showDialog, setShowDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
      {selectedAssignment?
      <AssignmentSubmission showDialog={showDialog} item={selectedAssignment} setShowDialog={setShowDialog} />
      : null}
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
                setSelectedAssignment(item);
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

function AssignmentSubmission({ item, showDialog, setShowDialog } : { item: object, showDialog: boolean, setShowDialog: Function }) {
  const { t, locale } = useTrans();
  const [res, refetch] = useAssignmentsSubmissionQuery({
    variables: {
      assignmentID: item.node.id
    }
  })

  console.log(res)

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

  const getFileNameFromUrl = (url: string): string => {
    if (url) {
      const tmp = url.split('/');
      const tmpLength = tmp.length;
  
      return tmpLength ? tmp[tmpLength - 1] : '';
    }
  
    return '';
  };
  

  return (
    <Dialog
      migrate
      useSafeArea
      bottom={true}
      height={500}
      panDirection={"UP"}
      visible={showDialog}
      onDismiss={() => {
        setShowDialog(false);
      }}
    >
      <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10 }}>
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
        
        {res.data?.assignmentSubmissions.edges ?
        <FlatList
          data={res.data?.assignmentSubmissions.edges}
          keyExtractor={(item, index) => index + "a"}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Touchable
              onPress={() => {
              }}
            >
              <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: '#bcbcbc', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <FilesIcon color="#fff" width={28} height={28} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#000", textAlign: "left" }} numberOfLines={1}>
                    {getFileNameFromUrl(item?.node?.files[0])}
                  </Text>
                  <Text style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}>
                    {Moment(item?.node?.submittedAt).format("Y-MM-DD")}
                  </Text>
                </View>
              </View>
            </Touchable>
          )}
        />
        : null}

        <Loading isLoading={res.fetching} height={'100%'} color={"#919191"} />

        <View style={{ borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
          <Touchable onPress={() => {
          }}>
            <View style={{ backgroundColor: "#d5d5d5", padding: 10 }}>
              <Text style={{ fontFamily: "Dubai-Regular", textAlign: 'center' }}>{t("upload_assignment_file")}</Text>
            </View>
          </Touchable>
        </View>

      </View>
    </Dialog>
  )
}
