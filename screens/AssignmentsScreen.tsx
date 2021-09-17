import * as React from "react";
import { useState } from "react";
import { View, FlatList, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons as Icon } from "@expo/vector-icons";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import dayjs from "dayjs";
import { Dialog, PanningProvider } from "react-native-ui-lib";
import DatePicker from "../components/DatePicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import * as mime from "react-native-mime-types";

import FilesIcon from "../assets/icons/Files.svg";

import {
  useAssignmentsQuery,
  useAssignmentsSubmissionQuery,
  useUpdateAssignmentSubmissionMutation,
  useAddAssignmentSubmissionMutation,
  AssignmentFragment,
} from "../generated/graphql";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { dateOnlyFormat } from "../constants/time";
import { ReactNativeFile } from "extract-files";
import { showErrToast } from "../util/toast";

export default function AssignmentsScreen({ navigation, route }: any) {
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
          paddingTop: 10 + top,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                {isExam ? t("exams") : t("assignments")}
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
                    setSelectedDate(null);
                  }}
                >
                  <KText style={{ fontSize: 10, color: "#fff", textAlign: "left" }}>
                    {selectedDate ? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY") : ""}
                  </KText>
                  <Icon style={{ paddingLeft: 10 }} name="close" size={12} color="#fff" />
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
        onChange={(date: any) => {
          setSelectedDate(date);
        }}
      />

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Assignments date={selectedDate ?? new Date()} isExam={isExam} />
      </View>
    </View>
  );
}

function Assignments({ date, isExam }: { date: Date; isExam: boolean }) {
  const [res, refetch] = useAssignmentsQuery({
    variables: {
      where: {
        dueDateGTE: dayjs(date).format(dateOnlyFormat),
        dueDateLT: dayjs(date).add(1, "day").format(dateOnlyFormat),
        isExam: isExam,
      },
    },
  });
  const { t } = useTrans();

  const [showDialog, setShowDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentFragment | null>();

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        height={500}
        color={"#fff"}
        msg={t("something_went_wrong")}
        btnText={t("retry")}
      />
    );
  }

  return (
    <>
      {selectedAssignment ? (
        <AssignmentSubmission showDialog={showDialog} assignment={selectedAssignment} setShowDialog={setShowDialog} />
      ) : null}
      {res.data?.assignments.edges ? (
        <FlatList
          data={res.data?.assignments.edges}
          keyExtractor={(item) => item?.node?.id ?? ""}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Touchable
              onPress={() => {
                setShowDialog(true);
                setSelectedAssignment(item?.node);
              }}
            >
              <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <View style={{ flex: 1 }}>
                  <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
                    {item?.node?.class.name} - {item?.node?.name}
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

interface AssignmentSubmissionProps {
  assignment: AssignmentFragment;
  showDialog: boolean;
  setShowDialog: Function;
}

function AssignmentSubmission({ assignment, showDialog, setShowDialog }: AssignmentSubmissionProps) {
  const { t } = useTrans();
  const [res, refetch] = useAssignmentsSubmissionQuery({ variables: { assignmentID: assignment?.id } });
  const [, updateSubmission] = useUpdateAssignmentSubmissionMutation();
  const [, addSubmission] = useAddAssignmentSubmissionMutation();
  const [, deleteSubmission] = useDeleteSubmission();

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
        msg={t("something_went_wrong")}
        btnText={t("retry")}
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

  const uploadFile = async (type: "file" | "image" = "file") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let files: (ReactNativeFile | File)[] = [];

    if (type === "file") {
      const docs = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (docs.type === "cancel" || !docs.output?.length) return;

      for (let i = 0; i < docs.output?.length; i++) {
        const doc = docs.output.item(i);
        if (!doc) continue;

        files.push(doc);

        //const name = doc.name.substr(doc.name.lastIndexOf("/") + 1);

        //files.push(new ReactNativeFile({ name, uri: doc.name, type: mime.lookup(doc.type) ?? "image" }));
      }

      if (!files.length) {
        return;
      }
    } else {
      const doc = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (doc.cancelled) return;

      files = [
        new ReactNativeFile({ uri: doc.uri, name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1), type: mime.lookup(doc.type) ?? "image" }),
      ];
    }

    if (!files.length) {
      return;
    }

    const submission = res.data?.assignmentSubmissions.edges![0]?.node;

    if (submission) {
      console.log("there is an assignment");
      const res = await updateSubmission({
        id: submission.id,
        input: { files },
      });
      if (res.error) {
        showErrToast(t("something_went_wrong"));
      }
    } else {
      const res = await addSubmission({ input: { assignmentID: assignment.id, files } });
      if (res.error) {
        showErrToast(t("something_went_wrong"));
      }
    }
  };

  return (
    <Dialog
      useSafeArea
      bottom={true}
      height={500}
      panDirection={PanningProvider.Directions.DOWN}
      visible={showDialog}
      onDismiss={() => {
        setShowDialog(false);
      }}
    >
      <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10 }}>
        <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
          <View style={{ flex: 1 }}>
            <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
              {assignment.class.name} - {assignment.name}
            </KText>
            <KText style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }} numberOfLines={1}>
              {assignment.description}
            </KText>
            <KText style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}>
              {t("updated")} {dayjs(assignment.updatedAt).fromNow()}
            </KText>
          </View>
          <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>{Moment(assignment?.dueDate).format("Y-MM-DD")}</KText>
        </View>

        {res.data?.assignmentSubmissions.edges![0]?.node?.files ? (
          <FlatList
            data={res.data?.assignmentSubmissions.edges[0]?.node?.files}
            keyExtractor={(file) => file}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }} />}
            renderItem={({ item }) => (
              <Touchable onPress={() => {}}>
                <View style={{ flexDirection: "row" }}>
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
                  <KText style={{ flex: 1, fontFamily: "Dubai-Regular", color: "#393939", textAlign: "left" }} numberOfLines={1}>
                    {getFileNameFromUrl(item)}
                  </KText>
                </View>
              </Touchable>
            )}
          />
        ) : null}

        <Loading isLoading={res.fetching} height={"100%"} color={"#919191"} />

        <Dialog
          useSafeArea
          bottom={true}
          height={100}
          panDirection={PanningProvider.Directions.DOWN}
          visible={fileTypeDialog}
          onDismiss={() => {
            setFileTypeDialog(false);
          }}
        >
          <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10, flexDirection: "row" }}>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable onPress={() => uploadFile("file")}>
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="document-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("file")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable onPress={() => uploadFile("image")}>
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="image-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("image")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        </Dialog>

        <View style={{ borderRadius: 5, overflow: "hidden" }}>
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
