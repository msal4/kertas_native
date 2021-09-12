import * as React from "react";
import { useState } from "react";
import { View, FlatList, StatusBar, Platform } from "react-native";
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
import FilesIcon from "../assets/icons/Files.svg";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";
import { ReactNativeFile } from "extract-files";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import {
  useAssignmentsQuery,
  useAssignmentsSubmissionQuery,
  useUpdateAssignmentSubmissionMutation,
  useAddAssignmentSubmissionMutation,
} from "../generated/graphql";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";

export default function AssignmentsScreen({ navigation, screenProps, route }: any) {
  const [showDate, setShowDate] = useState(false);
  const [isExam, setIsExam] = useState(route.params.isExam);
  const { top, bottom, right, left } = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(null);
  const { t, locale, isRTL } = useTrans();

  return (
    <View style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom, flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: "#f4f4f4",
          paddingTop: 20 + top,
          paddingBottom: 0,
        }}
      >
        <View style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center" }}>
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
                  <Ionicons name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"} size={24} color="#393939" />
                </View>
              </Touchable>
              <View style={{ flex: 1 }}>
                <KText
                  style={{
                    fontFamily: "Dubai-Medium",
                    color: "#393939",
                    fontSize: 20,
                    textAlign: "left",
                    marginHorizontal: 10,
                    paddingTop: 10,
                  }}
                >
                  {isExam ? t("exams") : t("assignments")}
                </KText>
                <View style={{ flexDirection: "row", opacity: selectedDate ? 1 : 0 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      borderRadius: 100,
                      overflow: "hidden",
                      backgroundColor: "#bcbcbc",
                      alignItems: "center",
                    }}
                  >
                    <KText style={{ fontFamily: "Dubai-Regular", color: "#fff", textAlign: "left", paddingHorizontal: 10 }}>
                      {selectedDate ? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY") : ""}
                    </KText>
                    <View style={{ borderRadius: 100, overflow: "hidden" }}>
                      <Touchable
                        onPress={() => {
                          setSelectedDate(null);
                        }}
                      >
                        <View style={{ width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
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
        <View style={{ paddingTop: 10, flexDirection: "row" }}>
          <Touchable
            style={{ marginRight: 15, borderBottomColor: "#a18cd1", borderBottomWidth: !isExam ? 3 : 0, minWidth: 80 }}
            onPress={() => {
              setIsExam(false);
            }}
          >
            <KText style={{ paddingHorizontal: 10, textAlign: "center" }}>{t("assignments")}</KText>
          </Touchable>
          <Touchable
            style={{
              marginRight: 15,
              borderBottomColor: "#a18cd1",
              borderBottomWidth: isExam ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setIsExam(true);
            }}
          >
            <KText style={{ paddingHorizontal: 10, textAlign: "center" }}>{t("exams")}</KText>
          </Touchable>
        </View>
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
        <Assignment selectedDate={selectedDate} isExam={isExam} />
      </View>
    </View>
  );
}

function Assignment({ selectedDate, isExam }: { selectedDate: Date; isExam: boolean }) {
  const [curDate] = useState(new Date());
  const [res, refetch] = useAssignmentsQuery({
    variables: {
      where: {
        dueDateGTE: dayjs(selectedDate ?? curDate)
          .set("hour", 3)
          .set("minute", 0)
          .set("second", 0)
          .toDate(),
        dueDateLT: selectedDate ? dayjs(selectedDate).add(1, "day").set("hour", 3).set("minute", 0).set("second", 0).toDate() : null,
        isExam: isExam,
      },
    },
  });
  const { t, locale } = useTrans();

  const [showDialog, setShowDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
      {selectedAssignment ? <AssignmentSubmission showDialog={showDialog} item={selectedAssignment} setShowDialog={setShowDialog} /> : null}
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
                  <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
                    {item?.node?.class.name} - {item?.node.name}
                  </KText>
                  <KText style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }} numberOfLines={1}>
                    {item?.node?.description}
                  </KText>
                </View>
                <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>{Moment(item?.node?.dueDate).format("Y-MM-DD")}</KText>
              </View>
            </Touchable>
          )}
        />
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#919191"} />
    </>
  );
}

function AssignmentSubmission({ item, showDialog, setShowDialog }: { item: object; showDialog: boolean; setShowDialog: Function }) {
  const { t, locale } = useTrans();
  const [res, refetch] = useAssignmentsSubmissionQuery({
    variables: {
      assignmentID: item.node.id,
    },
  });
  const [, updateSubmission] = useUpdateAssignmentSubmissionMutation();
  const [, addSubmission] = useAddAssignmentSubmissionMutation();

  const [fileTypeDialog, setFileTypeDialog] = useState(false);

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
      const tmp = url.split("/");
      const tmpLength = tmp.length;

      return tmpLength ? tmp[tmpLength - 1] : "";
    }

    return "";
  };

  const uploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const doc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (doc.cancelled) return;

    const filetype = mime.lookup(doc.uri) || "image";

    if (res.data?.assignmentSubmissions.edges[0]?.node?.files) {
      const ures = await updateSubmission({
        id: res.data?.assignmentSubmissions.edges[0]?.node?.id,
        input: {
          files: [new ReactNativeFile({ uri: doc.uri, name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1), type: filetype })],
        },
      });
    } else {
      const ures = await addSubmission({
        input: {
          files: [new ReactNativeFile({ uri: doc.uri, name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1), type: filetype })],
        },
      });
    }
  };

  const uploadFile = async () => {
    const doc = await DocumentPicker.getDocumentAsync();

    const filetype = mime.lookup(doc.uri) || "image";

    if (res.data?.assignmentSubmissions.edges[0]?.node?.files) {
      const ures = await updateSubmission({
        id: res.data?.assignmentSubmissions.edges[0]?.node?.id,
        input: {
          files: [new ReactNativeFile({ uri: doc.uri, name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1), type: filetype })],
        },
      });
    } else {
      const ures = await addSubmission({
        input: {
          files: [new ReactNativeFile({ uri: doc.uri, name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1), type: filetype })],
        },
      });
    }
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
            <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
              {item?.node?.class.name} - {item?.node.name}
            </KText>
            <KText style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }} numberOfLines={1}>
              {item?.node?.description}
            </KText>
            <KText style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}>
              {t("updated")} {dayjs(item?.node?.updatedAt).fromNow()}
            </KText>
          </View>
          <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>{Moment(item?.node?.dueDate).format("Y-MM-DD")}</KText>
        </View>

        {res.data?.assignmentSubmissions.edges[0]?.node?.files ? (
          <FlatList
            data={res.data?.assignmentSubmissions.edges[0]?.node?.files}
            keyExtractor={(item, index) => index + "a"}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Touchable onPress={() => {}}>
                <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                      backgroundColor: "#f4f4f4",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FilesIcon fill="#a18cd1" width={28} height={28} />
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <KText style={{ fontFamily: "Dubai-Regular", color: "#393939", textAlign: "left" }} numberOfLines={1}>
                      {getFileNameFromUrl(item)}
                    </KText>
                  </View>
                </View>
              </Touchable>
            )}
          />
        ) : null}

        <Loading isLoading={res.fetching} height={"100%"} color={"#919191"} />

        <Dialog
          migrate
          useSafeArea
          bottom={true}
          height={100}
          panDirection={"UP"}
          visible={fileTypeDialog}
          onDismiss={() => {
            setFileTypeDialog(false);
          }}
        >
          <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10, flexDirection: "row" }}>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable onPress={uploadFile}>
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="document-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("file")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable onPress={uploadImage}>
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="image-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("image")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        </Dialog>

        <View style={{ borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
          <Touchable
            onPress={() => {
              setFileTypeDialog(true);
            }}
          >
            <View style={{ backgroundColor: "#a18cd1", padding: 10 }}>
              <KText style={{ fontFamily: "Dubai-Regular", textAlign: "center", color: "#fff" }}>{t("upload_assignment_file")}</KText>
            </View>
          </Touchable>
        </View>
      </View>
    </Dialog>
  );
}
