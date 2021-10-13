import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { memo, useRef, useState } from "react";
import {
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DatePicker from "../components/DatePicker";
import { KText } from "../components/KText";
import { RootStackScreenProps } from "../types";
import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import {
  AttendanceFragment,
  AttendanceState,
  AttendanceWithStudentFragment,
  ClassMinimalFragment,
  Role,
  useAllClassesQuery,
  useAttendancesQuery,
  useStudentsAttendancesQuery,
  useUpdateAttendanceMutation,
  useStudentsQuery,
  UserFragment,
  useAddAttendanceMutation,
} from "../generated/graphql";
import { Error } from "../components/Error";
import { useNavigation } from "@react-navigation/native";
import { ItemSelector } from "../components/ItemSelector";
import { useMe } from "../hooks/useMe";
import { cdnURL } from "../constants/Config";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { showErrToast, showSuccessToast } from "../util/toast";

export function AttendanceScreen({ navigation }: RootStackScreenProps<"Attendance">) {
  const { t, locale, isRTL } = useTrans();
  const { me } = useMe();
  const { top, right, left } = useSafeAreaInsets();
  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const classSelectorRef = useRef<ItemSelector>();
  const [currentClass, setCurrentClass] = useState<ClassMinimalFragment>();

  const attendanceForm = useRef<ScrollBottomSheet<any>>();

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
          paddingRight: right + 10,
          backgroundColor: "#f4f4f4",
          paddingTop: 10 + top,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <View>
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
                      {selectedDate
                        ? dayjs(selectedDate).locale(locale).format("D - MMMM - YYYY")
                        : ""}
                    </KText>
                    <Ionicons style={{ paddingLeft: 10 }} name="close" size={12} color="#fff" />
                  </Touchable>
                ) : null}
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
                backgroundColor: "#fff",
                borderRadius: 100,
                width: 50,
                height: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="calendar-outline" size={28} color="#a18cd1" />
            </View>
          </Touchable>
        </View>
        {isTeacher ? (
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                attendanceForm.current?.snapTo(1);
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  marginLeft: 15,
                  borderRadius: 999,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={24} color="#a18cd1" />
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
        <StudentsAttendanceList
          currentClass={currentClass}
          date={selectedDate ?? new Date()}
          classSelectorRef={classSelectorRef}
          onClassSelected={setCurrentClass}
          attendanceFormRef={attendanceForm}
        />
      ) : (
        <AttendanceList date={selectedDate ?? new Date()} />
      )}
    </>
  );
}

function StudentsAttendanceList({
  date,
  classSelectorRef,
  attendanceFormRef,
  currentClass,
  onClassSelected,
}: {
  currentClass?: ClassMinimalFragment;
  date: Date;
  classSelectorRef: any;
  attendanceFormRef: any;
  onClassSelected: any;
}) {
  const d = dayjs(dayjs(date).format("YYYY-MM-DD"));

  const [classesRes] = useAllClassesQuery();
  const classes = classesRes.data?.classes.edges?.map((c) => c!.node!);

  React.useEffect(() => {
    if (!currentClass && classes && classes?.length) {
      onClassSelected(classes![0]);
    }
  }, [classes]);

  const after = useRef<any>();
  const [res, refetch] = useStudentsAttendancesQuery({
    variables: {
      classID: currentClass?.id as any,
      after: after.current,
      where: { dateGT: dayjs(d).toDate(), dateLT: dayjs(date).add(1, "day").toDate() },
    },
  });
  const { bottom, right, left } = useSafeAreaInsets();
  const [, updateAttendance] = useUpdateAttendanceMutation();
  const stateSelector = useRef<ItemSelector>();
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceWithStudentFragment>();
  const { t } = useTrans();

  if (!currentClass) return null;

  return (
    <>
      {res.data?.attendances ? (
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={{ margin: 15, borderColor: "#39393922", borderWidth: 0.5 }} />
          )}
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
          renderItem={({ item }) => (
            <AttendanceWithStudentItem
              item={item?.node!}
              onPress={() => {
                setCurrentAttendance(item?.node!);
                stateSelector.current?.open();
              }}
            />
          )}
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
      {classes ? (
        <ItemSelector
          ref={classSelectorRef}
          data={classes.map((c) => ({ title: c.name, value: c.id, subtitle: c.stage.name }))}
          currentValue={currentClass?.id}
          onChange={(item) => {
            onClassSelected(classes.find((c) => c.id === item.value));
            classSelectorRef.current?.close();
          }}
        />
      ) : null}
      <ItemSelector
        ref={stateSelector}
        data={Object.values(AttendanceState).map((value) => ({
          title: t(value.toLowerCase()),
          value: value,
        }))}
        currentValue={currentAttendance?.state}
        itemBackground={getAttendanceStateColor}
        titleColor={getAttendanceStateColor}
        onChange={(item) => {
          //onClassSelected(classes.find((c) => c.id === item.value));
          //classSelectorRef.current?.close();
          updateAttendance({ id: currentAttendance!.id, input: { state: item.value } });
        }}
      />
      {currentClass && (
        <AddAttendanceForm
          ref={attendanceFormRef}
          currentClass={currentClass}
          currentDate={date}
          onUpdate={() => refetch()}
        />
      )}
    </>
  );
}

const windowHeight = Dimensions.get("window").height;

const middlePoint = windowHeight >= 800 ? 250 : "20%";

const AddAttendanceForm = React.forwardRef(
  (
    {
      currentClass,
      currentDate,
      onUpdate,
    }: { currentClass: ClassMinimalFragment; currentDate: Date; onUpdate: () => void },
    ref
  ) => {
    const { top, bottom } = useSafeAreaInsets();
    const { t } = useTrans();
    const [currentStudent, setCurrentStudent] = useState<string>();
    const studentSelector = useRef<ItemSelector>();

    const [res, refetch] = useStudentsQuery();
    const students = res.data?.users?.edges!.map((e) => e!.node!);

    const [, addAttendance] = useAddAttendanceMutation();
    const [currentState, setCurrentState] = useState<AttendanceState>(AttendanceState.Present);
    const stateSelector = useRef<ItemSelector>();

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
          <Touchable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: 20,
              marginBottom: 20,
              borderRadius: 15,
            }}
            onPress={() => {
              studentSelector.current?.open();
            }}
          >
            <KText>{students?.find((s) => s.id === currentStudent)?.name ?? t("student")}</KText>
            <Ionicons name="chevron-down" size={15} />
          </Touchable>

          <Touchable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: 20,
              marginBottom: 20,
              borderRadius: 15,
            }}
            onPress={() => {
              stateSelector.current?.open();
            }}
          >
            <KText>{t(currentState.toLowerCase())}</KText>
            <Ionicons name="chevron-down" size={15} />
          </Touchable>

          <Touchable
            style={{ marginTop: 20, padding: 20, borderRadius: 20, backgroundColor: "#a18cd1" }}
            onPress={async () => {
              if (!currentStudent || !currentClass) return;
              const res = await addAttendance({
                input: {
                  state: currentState,
                  date: currentDate,
                  studentID: currentStudent,
                  classID: currentClass.id,
                },
              });

              if (res.error) {
                showErrToast(t("something_went_wrong"));
                console.log(res.error);
                return;
              }

              showSuccessToast(t("updated_successfully"));

              onUpdate();
            }}
          >
            <KText style={{ color: "#fff", textAlign: "center" }}>{t("update")}</KText>
          </Touchable>
        </ScrollBottomSheet>
        <ItemSelector
          ref={studentSelector}
          data={[
            { value: undefined, title: t("student") },
            ...(students?.map((s) => ({ value: s.id, title: s.name })) ?? []),
          ]}
          currentValue={currentStudent}
          onChange={(item) => {
            setCurrentStudent(item.value);
          }}
        />
        <ItemSelector
          ref={stateSelector}
          data={Object.values(AttendanceState).map((value) => ({
            title: t(value.toLowerCase()),
            value: value,
          }))}
          currentValue={currentState}
          itemBackground={getAttendanceStateColor}
          titleColor={getAttendanceStateColor}
          onChange={(item) => {
            setCurrentState(item.value);
          }}
        />
      </>
    );
  }
);

function AttendanceList({ date }: { date: Date }) {
  const d = dayjs(dayjs(date).format("YYYY-MM-DD"));

  const after = useRef<any>();
  const [res, refetch] = useAttendancesQuery({
    variables: {
      after: after.current,
      where: { dateGT: dayjs(d).toDate(), dateLT: dayjs(date).add(1, "day").toDate() },
    },
  });
  const { bottom, right, left } = useSafeAreaInsets();

  return (
    <>
      <Error isError={!!res.error} onPress={refetch} />
      {res.data?.attendances ? (
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={{ margin: 15, borderColor: "#39393922", borderWidth: 0.5 }} />
          )}
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

const AttendanceWithStudentItem = memo(function ({
  item,
  onPress,
}: {
  item: AttendanceWithStudentFragment;
  onPress: () => void;
}) {
  const { t } = useTrans();
  const color = getAttendanceStateColor(item.state);
  //const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", justifyContent: "space-between" }}
      onPress={() => {
        onPress();
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: `${cdnURL}/${item.student.image}` }}
          style={{
            marginRight: 10,
            borderRadius: 999,
            width: 30,
            height: 30,
          }}
        />
        <KText style={{ color: "#393939" }}>{item.student.name}</KText>
      </View>
      <KText style={{ color }}>{t(item.state.toLowerCase())}</KText>
    </TouchableOpacity>
  );
});
