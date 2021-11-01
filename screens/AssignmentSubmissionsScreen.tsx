import * as React from "react";
import { useRef, useState } from "react";
import {
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Linking,
  Dimensions,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Moment from "moment";
import { Touchable } from "../components/Touchable";
import dayjs from "dayjs";
import { Dialog, PanningProvider } from "react-native-ui-lib";
import DatePicker from "../components/DatePicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import * as mime from "react-native-mime-types";

import FilesIcon from "../assets/icons/Files.svg";

import {
  AssignmentFragment,
  useAssignmentQuery,
  AssignmentSubmissionWithStudentFragment,
  useUpdateAssignmentMutation,
} from "../generated/graphql";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { ReactNativeFile } from "extract-files";
import { showErrToast, showSuccessToast } from "../util/toast";
import { cdnURL } from "../constants/Config";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { RootStackScreenProps } from "../types";
import { CollapsableText } from "../components/CollapsableText";

export function AssignmentSubmissionsScreen({
  navigation,
  route,
}: RootStackScreenProps<"AssignmentSubmissions">) {
  const [] = useState(false);
  const { top, right, left } = useSafeAreaInsets();
  const { t, isRTL } = useTrans();
  const [res, refetch] = useAssignmentQuery({ variables: { id: route.params.assignmentID } });
  const assignmentFormRef = useRef<ScrollBottomSheet<any>>();

  const assignment = res.data?.assignment;

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
                {t("submissions")}
              </KText>

              <View style={{ flex: 1 }} />
              <Touchable
                style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}
                onPress={() => {
                  assignmentFormRef.current?.snapTo(0);
                }}
              >
                <Ionicons name="pencil-outline" style={{ marginHorizontal: 10 }} color="#6862a9" />
                <KText style={{ color: "#6862a9" }}>{t("edit")}</KText>
              </Touchable>
            </View>

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
                  {assignment?.class.name} - {assignment?.name}
                </KText>
                <CollapsableText
                  style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}
                >
                  {assignment?.description}
                </CollapsableText>
                {assignment?.file ? (
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
                    <KText
                      style={{ fontFamily: "Dubai-Regular", color: "#6862a9", marginLeft: 10 }}
                    >
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
                  {t("updated")} {dayjs(assignment?.updatedAt).fromNow()}
                </KText>
              </View>
              <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
                {Moment(assignment?.dueDate).format("Y-MM-DD")}
              </KText>
            </View>
          </View>
        </View>
      </View>
      {assignment && (
        <Submissions submissions={assignment?.submissions?.edges?.map((e) => e!.node!)} />
      )}
      {assignment && (
        <EditAssignmentForm
          assignment={assignment}
          ref={assignmentFormRef}
          onUpdate={() => {
            refetch();
          }}
        />
      )}
    </>
  );
}

function Submissions({ submissions }: { submissions?: AssignmentSubmissionWithStudentFragment[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [currentSubmission, setCurrentSubmission] =
    useState<AssignmentSubmissionWithStudentFragment>();

  return (
    <>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: "white" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Touchable
            onPress={() => {
              setCurrentSubmission(item);
              setShowDialog(true);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: `${cdnURL}/${item.student.image}` }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                />
                <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
                  {item.student.name}
                </KText>
              </View>
              <KText style={{ fontFamily: "Dubai-Regular", color: "#919191" }}>
                {Moment(item.createdAt).format("Y-MM-DD")}
              </KText>
            </View>
          </Touchable>
        )}
      />
      <AssignmentSubmission
        submission={currentSubmission}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
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

const EditAssignmentForm = React.forwardRef(
  (
    {
      assignment,
      onUpdate,
    }: {
      assignment: AssignmentFragment;
      onUpdate: () => void;
    },
    ref
  ) => {
    const { top, bottom } = useSafeAreaInsets();
    const { t } = useTrans();
    const [name, setName] = useState(assignment.name);
    const [description, setDescription] = useState(assignment.description ?? "");
    const [file, setFile] = useState<ReactNativeFile>();
    const [dueDate, setDueDate] = useState(dayjs(assignment.dueDate).toDate());
    const [showDate, setShowDate] = useState(false);
    const [duration, setDuration] = useState<number>(assignment.duration);
    const [fileTypeDialogShown, setFileTypeDialogShown] = useState(false);

    const [, updateAssignment] = useUpdateAssignmentMutation();

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
          {assignment.isExam ? (
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
              <KText style={{ textAlign: "center" }} numberOfLines={1} ellipsizeMode="head">
                {file?.name ?? assignment.file ?? t("file")}
              </KText>
            </Touchable>
          </View>

          <Touchable
            style={{ marginTop: 20, padding: 20, borderRadius: 20, backgroundColor: "#6862a9" }}
            onPress={async () => {
              const res = await updateAssignment({
                id: assignment.id,
                input: {
                  name,
                  dueDate,
                  duration,
                  file,
                  description,
                },
              });

              if (res.error) {
                showErrToast(t("something_went_wrong"));
                return;
              }

              showSuccessToast(t("updated_successfully"));

              onUpdate();
            }}
          >
            <KText style={{ color: "#fff", textAlign: "center" }}>{t("update")}</KText>
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

interface AssignmentSubmissionProps {
  submission?: AssignmentSubmissionWithStudentFragment;
  showDialog: boolean;
  setShowDialog: Function;
}

function AssignmentSubmission({
  submission,
  showDialog,
  setShowDialog,
}: AssignmentSubmissionProps) {
  const { t } = useTrans();

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
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <Image
            source={{ uri: `${cdnURL}/${submission?.student.image}` }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <KText style={{ fontFamily: "Dubai-Medium", color: "#393939", textAlign: "left" }}>
            {submission?.student.name}
          </KText>
          <View style={{ flex: 1 }} />
          <KText style={{ textAlign: "left" }}>
            {t("updated")} {dayjs(submission?.updatedAt).fromNow()}
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
            renderItem={({ item }) => (
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
                </View>
              </Touchable>
            )}
          />
        ) : null}
      </View>
    </Dialog>
  );
}
