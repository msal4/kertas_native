import * as React from "react";
import { useRef, useState } from "react";
import {
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Linking,
  TextProps,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
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
  useDeleteSubmissionFileMutation,
  Role,
  ClassMinimalFragment,
  useAllClassesQuery,
  useAddAssignmentMutation,
} from "../generated/graphql";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { dateOnlyFormat } from "../constants/time";
import { ReactNativeFile } from "extract-files";
import { showErrToast, showSuccessToast } from "../util/toast";
import { cdnURL } from "../constants/Config";
import { useMe } from "../hooks/useMe";
import { ItemSelector } from "../components/ItemSelector";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { CollapsableText } from "../components/CollapsableText";

export default function AssignmentsScreen({ navigation, route }: any) {
  const [showDate, setShowDate] = useState(false);
  const [isExam, setIsExam] = useState(route.params.isExam);
  const { top, right, left } = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(null);
  const { t, locale, isRTL } = useTrans();
  const { me } = useMe();
  const classSelectorRef = React.useRef<ItemSelector>();
  const [currentClass, setCurrentClass] = useState<ClassMinimalFragment>();
  const assignmentFormRef = React.useRef<ScrollBottomSheet<any>>();

  const openClassSelector = () => {
    classSelectorRef.current?.open();
  };

  const isTeacher = me?.role === Role.Teacher;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          paddingLeft: left,
          paddingRight: right,
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
                  <Ionicons
                    name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"}
                    size={24}
                    color="#393939"
                  />
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
                    backgroundColor: "#6862a9",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    marginLeft: 5,
                  }}
                  onPress={() => {
                    setSelectedDate(null);
                  }}
                >
                  <KText style={{ fontSize: 10, color: "#fff", textAlign: "left" }}>
                    {selectedDate
                      ? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY")
                      : ""}
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
              <Ionicons name="calendar-outline" size={28} color="#6862a9" />
            </View>
          </Touchable>
        </View>
        {isTeacher ? (
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                assignmentFormRef.current?.snapTo(1);
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 999,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={24} color="#6862a9" />
              </View>
              <KText style={{ marginLeft: 10, color: "#393939" }}>{t("add")}</KText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={openClassSelector}
            >
              <KText style={{ marginRight: 5, color: "#393939" }}>{currentClass?.name}</KText>
              <Ionicons name="chevron-down" />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={{ paddingTop: 10, flexDirection: "row" }}>
          <Touchable
            style={{
              paddingHorizontal: 20,
              borderBottomColor: "#6862a9",
              borderBottomWidth: !isExam ? 3 : 0,
              minWidth: 80,
            }}
            onPress={() => {
              setIsExam(false);
            }}
          >
            <KText style={{ textAlign: "center" }}>{t("assignments")}</KText>
          </Touchable>
          <Touchable
            style={{
              paddingHorizontal: 20,
              borderBottomColor: "#6862a9",
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

      {isTeacher ? (
        <TeacherAssignments
          date={selectedDate ?? new Date()}
          isExam={isExam}
          currentClassID={currentClass?.id}
          onClassSelected={setCurrentClass}
          classSelectorRef={classSelectorRef}
          assignmentFormRef={assignmentFormRef}
        />
      ) : (
        <Assignments date={selectedDate ?? new Date()} isExam={isExam} />
      )}
    </>
  );
}

function TeacherAssignments({
  date,
  isExam,
  classSelectorRef,
  onClassSelected,
  currentClassID,
  assignmentFormRef,
}: {
  date: Date;
  isExam: boolean;
  classSelectorRef: any;
  assignmentFormRef: any;
  onClassSelected: any;
  currentClassID?: string;
}) {
  const [res, refetch] = useAssignmentsQuery({
    variables: {
      where: {
        dueDateGTE: dayjs(date).format(dateOnlyFormat),
        dueDateLT: dayjs(date).add(1, "day").format(dateOnlyFormat),
        isExam: isExam,
      },
    },
  });
  const navigation = useNavigation();

  const [classesRes] = useAllClassesQuery();
  const classes = classesRes.data?.classes.edges?.map((c) => c!.node!);

  React.useEffect(() => {
    if (!currentClassID && classes && classes?.length) {
      onClassSelected(classes![0]);
    }
  }, [classes]);

  return (
    <>
      {res.data?.assignments.edges ? (
        <FlatList
          data={res.data?.assignments.edges}
          keyExtractor={(item) => item?.node?.id ?? ""}
          style={{ backgroundColor: "white" }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Touchable
              onPress={() => {
                navigation.navigate("AssignmentSubmissions", { assignmentID: item!.node!.id });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                }}
              >
                <View style={{ flex: 1 }}>
                  <KText
                    style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}
                  >
                    {item?.node?.class.name} - {item?.node?.name}
                  </KText>
                  <KText
                    style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}
                    numberOfLines={1}
                  >
                    {item?.node?.description}
                  </KText>
                </View>
                <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
                  {Moment(item?.node?.dueDate).format("Y-MM-DD")}
                </KText>
              </View>
            </Touchable>
          )}
        />
      ) : null}
      {classes ? (
        <ItemSelector
          ref={classSelectorRef}
          data={classes.map((c) => ({ title: c.name, value: c.id, subtitle: c.stage.name }))}
          currentValue={currentClassID}
          onChange={(item) => {
            onClassSelected(classes.find((c) => c.id === item.value));
            classSelectorRef.current?.close();
          }}
        />
      ) : null}
      {currentClassID && (
        <AddAssignmentForm
          isExam={isExam}
          ref={assignmentFormRef}
          currentClassID={currentClassID}
          onUpdate={() => {
            refetch();
          }}
        />
      )}
    </>
  );
}

const chooseFile = async (type: "file" | "image") => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
    return;
  }

  if (type === "file") {
    const doc = await DocumentPicker.getDocumentAsync({ multiple: true });

    if (doc.type === "cancel") return;

    return new ReactNativeFile({
      uri: doc.uri,
      name: doc.name,
      type: mime.lookup(doc.type) ?? "application/octet-stream",
    });
  }

  const doc = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (doc.cancelled) return;

  return new ReactNativeFile({
    uri: doc.uri,
    name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1),
    type: mime.lookup(doc.type) ?? "image",
  });
};

const windowHeight = Dimensions.get("window").height;

const middlePoint = windowHeight >= 800 ? 250 : "20%";

const AddAssignmentForm = React.forwardRef(
  (
    {
      isExam,
      currentClassID,
      onUpdate,
    }: {
      currentClassID: string;
      onUpdate: () => void;
      isExam: boolean;
    },
    ref
  ) => {
    const { top, bottom } = useSafeAreaInsets();
    const { t } = useTrans();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<ReactNativeFile>();
    const [dueDate, setDueDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [duration, setDuration] = useState<number>();
    const [fileTypeDialogShown, setFileTypeDialogShown] = useState(false);

    const [, addAssignment] = useAddAssignmentMutation();

    const { isRTL } = useTrans();

    return (
      <>
        <ScrollBottomSheet
          ref={ref as any}
          componentType="ScrollView"
          snapPoints={[top, middlePoint, windowHeight]}
          initialSnapIndex={2}
          renderHandle={() => (
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#f4f4f4",
                paddingVertical: 20,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: 4,
                }}
              />
            </View>
          )}
          containerStyle={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: bottom,
            backgroundColor: "#f4f4f4",
            overflow: "hidden",
            paddingHorizontal: 20,
          }}
        >
          <View style={{ marginBottom: 10, flex: 1 }}>
            <KText style={{ marginBottom: 5 }}>{t("name")}</KText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("name")}
              style={{
                textAlign: isRTL ? "right" : undefined,
                padding: 20,
                borderRadius: 15,
                backgroundColor: "white",
                width: "100%",
              }}
            />
          </View>
          <View style={{ marginBottom: 10, flex: 1 }}>
            <KText style={{ marginBottom: 5 }}>{t("description")}</KText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t("description")}
              style={{
                textAlign: isRTL ? "right" : undefined,
                padding: 20,
                borderRadius: 15,
                backgroundColor: "white",
                width: "100%",
              }}
            />
          </View>
          {isExam ? (
            <View style={{ marginBottom: 10, flex: 1 }}>
              <KText style={{ marginBottom: 5 }}>
                {t("duration")} ({t("minutes").toLowerCase()})
              </KText>
              <TextInput
                value={duration?.toString()}
                onChangeText={(v) => setDuration(parseInt(v))}
                placeholder={t("duration")}
                keyboardType="number-pad"
                style={{
                  textAlign: isRTL ? "right" : undefined,
                  padding: 20,
                  borderRadius: 15,
                  backgroundColor: "white",
                  width: "100%",
                }}
              />
            </View>
          ) : null}

          <View style={{ marginBottom: 10, flex: 1 }}>
            <KText style={{ marginBottom: 5 }}>{t("dueDate")}</KText>
            <Touchable
              style={{ padding: 20, borderRadius: 20, backgroundColor: "#fff" }}
              onPress={() => {
                setShowDate(true);
              }}
            >
              <KText style={{ textAlign: "center" }}>
                {dayjs(dueDate).format("hh:mm a YYYY-MM-DD")}
              </KText>
            </Touchable>
          </View>

          <View style={{ marginBottom: 10, flex: 1 }}>
            <KText style={{ marginBottom: 5 }}>{t("file")}</KText>
            <Touchable
              style={{ padding: 20, borderRadius: 20, backgroundColor: "#fff" }}
              onPress={() => {
                setFileTypeDialogShown(true);
              }}
            >
              <KText style={{ textAlign: "center" }} numberOfLines={1}>
                {file?.name ?? t("file")}
              </KText>
            </Touchable>
          </View>

          <Touchable
            style={{ marginTop: 20, padding: 20, borderRadius: 20, backgroundColor: "#6862a9" }}
            onPress={async () => {
              if (!currentClassID) return;
              const res = await addAssignment({
                input: {
                  name,
                  dueDate,
                  classID: currentClassID,
                  file,
                  isExam,
                  duration,
                  description,
                },
              });

              if (res.error) {
                showErrToast(t("something_went_wrong"));
                return;
              }

              showSuccessToast(t("added_successfully"));

              onUpdate();
            }}
          >
            <KText style={{ color: "#fff", textAlign: "center" }}>{t("add")}</KText>
          </Touchable>
        </ScrollBottomSheet>
        <DatePicker
          showed={showDate}
          value={dueDate}
          mode={"datetime"}
          onDismiss={() => {
            setShowDate(false);
          }}
          onChange={(date: any) => {
            setDueDate(date);
          }}
        />
        <Dialog
          useSafeArea
          bottom={true}
          height={100}
          panDirection={PanningProvider.Directions.DOWN}
          visible={fileTypeDialogShown}
          onDismiss={() => {
            setFileTypeDialogShown(false);
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flex: 1,
              borderRadius: 20,
              overflow: "hidden",
              padding: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable
                  onPress={async () => {
                    setFile(await chooseFile("file"));
                    setFileTypeDialogShown(false);
                  }}
                >
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="document-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("file")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable
                  onPress={async () => {
                    setFile(await chooseFile("image"));
                    setFileTypeDialogShown(false);
                  }}
                >
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="image-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("image")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        </Dialog>
      </>
    );
  }
);

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
        color={"#fff"}
        msg={t("something_went_wrong")}
        btnText={t("retry")}
      />
    );
  }

  return (
    <>
      {selectedAssignment ? (
        <AssignmentSubmission
          showDialog={showDialog}
          assignment={selectedAssignment}
          setShowDialog={setShowDialog}
        />
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
              <View
                style={{
                  flexDirection: "row",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                }}
              >
                <View style={{ flex: 1 }}>
                  <KText
                    style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}
                  >
                    {item?.node?.class.name} - {item?.node?.name}
                  </KText>
                  <KText
                    style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}
                    numberOfLines={1}
                  >
                    {item?.node?.description}
                  </KText>
                </View>
                <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
                  {Moment(item?.node?.dueDate).format("Y-MM-DD")}
                </KText>
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

function AssignmentSubmission({
  assignment,
  showDialog,
  setShowDialog,
}: AssignmentSubmissionProps) {
  const { t } = useTrans();
  const [res, refetch] = useAssignmentsSubmissionQuery({
    variables: { assignmentID: assignment?.id },
  });
  const [, updateSubmission] = useUpdateAssignmentSubmissionMutation();
  const [, addSubmission] = useAddAssignmentSubmissionMutation();
  const [, deleteSubmissionFile] = useDeleteSubmissionFileMutation();

  const [fileTypeDialog, setFileTypeDialog] = useState(false);

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        color={"#fff"}
        msg={t("something_went_wrong")}
        btnText={t("retry")}
      />
    );
  }

  const uploadFile = async (type: "file" | "image" = "file") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let files: (ReactNativeFile | File)[] = [];

    if (type === "file") {
      const doc = await DocumentPicker.getDocumentAsync({ multiple: true });

      if (doc.type === "cancel") return;

      files = [
        new ReactNativeFile({
          uri: doc.uri,
          name: doc.name,
          type: mime.lookup(doc.type) ?? "application/octet-stream",
        }),
      ];
    } else {
      const doc = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (doc.cancelled) return;

      files = [
        new ReactNativeFile({
          uri: doc.uri,
          name: doc.uri.substr(doc.uri.lastIndexOf("/") + 1),
          type: mime.lookup(doc.type) ?? "image",
        }),
      ];
    }

    if (!files.length) {
      return;
    }

    const submission = res.data?.assignmentSubmissions.edges![0]?.node;

    if (submission) {
      const res = await updateSubmission({
        id: submission.id,
        input: { files },
      });
      if (res.error) {
        showErrToast(t("something_went_wrong"));
        return;
      }
    } else {
      const res = await addSubmission({ input: { assignmentID: assignment.id, files } });
      if (res.error) {
        showErrToast(t("something_went_wrong"));
        return;
      }
    }
    refetch();
  };

  const submission = res.data?.assignmentSubmissions.edges![0]?.node;

  const examIsOverdue =
    assignment.isExam &&
    dayjs(assignment.dueDate).add(assignment.duration, "minutes").isBefore(dayjs());

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
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          borderRadius: 20,
          overflow: "hidden",
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <View style={{ flex: 1 }}>
            <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
              {assignment.class.name} - {assignment.name}
            </KText>
            <CollapsableText
              style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}
            >
              {assignment.description}
            </CollapsableText>
            {assignment.file ? (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                  marginBottom: 10,
                }}
                onPress={() => {
                  const url = `${cdnURL}/${assignment.file}`;
                  if (Linking.canOpenURL(url)) {
                    Linking.openURL(url);
                  }
                }}
              >
                <FilesIcon fill="#6862a9" width={15} height={15} />
                <KText style={{ fontFamily: "Dubai-Regular", color: "#6862a9", marginLeft: 10 }}>
                  {t("assignment_attachment")}
                </KText>
              </TouchableOpacity>
            ) : null}
            <KText
              style={{
                fontFamily: "Dubai-Regular",
                color: "#919191",
                textAlign: "left",
                fontSize: 12,
              }}
            >
              {t("updated")} {dayjs(assignment.updatedAt).fromNow()}
            </KText>
          </View>
          <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
            {Moment(assignment?.dueDate).format("Y-MM-DD")}
          </KText>
        </View>

        {submission?.files ? (
          <FlatList
            data={submission.files}
            keyExtractor={(file) => file}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{ marginVertical: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}
              />
            )}
            renderItem={({ item, index }) => (
              <Touchable
                onPress={() => {
                  const url = `${cdnURL}/${item}`;
                  if (Linking.canOpenURL(url)) {
                    Linking.openURL(url);
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                      backgroundColor: "#f4f4f4",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <FilesIcon fill="#6862a9" width={28} height={28} />
                  </View>
                  <KText
                    style={{ flex: 1, color: "#393939aa", textAlign: "left" }}
                    ellipsizeMode="head"
                    numberOfLines={1}
                  >
                    {item}
                  </KText>
                  <TouchableOpacity
                    disabled={examIsOverdue}
                    onPress={() => {
                      Alert.alert(t("delete_file"), t("delete_file_assertion"), [
                        {
                          style: "cancel",
                          text: t("no"),
                        },
                        {
                          text: t("yes"),
                          style: "destructive",
                          onPress: () => {
                            deleteSubmissionFile({ index, id: submission.id });
                          },
                        },
                      ]);
                    }}
                  >
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="trash-outline"
                      color={examIsOverdue ? "#919191" : "#E05D5D"}
                      size={20}
                    />
                  </TouchableOpacity>
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
          <View
            style={{
              backgroundColor: "#fff",
              flex: 1,
              borderRadius: 20,
              overflow: "hidden",
              padding: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable
                  onPress={async () => {
                    await uploadFile("file");
                    setFileTypeDialog(false);
                  }}
                >
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="document-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("file")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <Touchable
                  onPress={async () => {
                    await uploadFile("image");
                    setFileTypeDialog(false);
                  }}
                >
                  <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="image-outline" size={28} color="#777" />
                    <KText style={{ color: "#393939" }}>{t("image")}</KText>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        </Dialog>

        <TouchableOpacity
          disabled={examIsOverdue}
          style={{
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: examIsOverdue ? "#919191" : "#6862a9",
            padding: 10,
          }}
          onPress={() => {
            setFileTypeDialog(true);
          }}
        >
          <KText style={{ fontFamily: "Dubai-Regular", textAlign: "center", color: "#fff" }}>
            {t("upload_assignment_file")}
          </KText>
        </TouchableOpacity>
      </View>
    </Dialog>
  );
}
