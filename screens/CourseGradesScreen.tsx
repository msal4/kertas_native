import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons as Icon, Ionicons } from "@expo/vector-icons";
import { Touchable } from "../components/Touchable";
import Loading from "../components/Loading";
import { Error } from "../components/Error";

import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import {
  useCourseGradesQuery,
  useClassesQuery,
  Role,
  ClassMinimalFragment,
  useAllClassesQuery,
  useClassStudentsQuery,
  UserFragment,
  Course,
  useAddCourseGradeMutation,
  useUpdateCourseGradeMutation,
} from "../generated/graphql";
import { useMe } from "../hooks/useMe";
import { useNavigation } from "@react-navigation/native";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import Years from "../constants/Years";
import { ItemSelector } from "../components/ItemSelector";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import getCurrentYear from "../util/getCurrentYear";
import { showErrToast, showSuccessToast } from "../util/toast";
import { cdnURL } from "../constants/Config";

export default function CourseGradesScreen() {
  const { me } = useMe();
  if (!me) return null;

  return me?.role === Role.Teacher ? (
    <_TeacherCourseGradesScreen />
  ) : (
    <_StudentCourseGradesScreen />
  );
}

const windowHeight = Dimensions.get("window").height;

type Year = ValueOf<typeof Years>;

const thisYear = getCurrentYear();

function _TeacherCourseGradesScreen() {
  const { left, right, top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, isRTL } = useTrans();

  const [classesRes, refetch] = useAllClassesQuery();
  const [currentClass, setCurrentClass] = useState<ClassMinimalFragment>();
  const [currentStudent, setCurrentStudent] = useState<UserFragment>();
  const [currentYear, setCurrentYear] = useState<Year>(thisYear);
  const [currentCourse, setCurrentCourse] = useState(Course.First);

  const classes = classesRes.data?.classes.edges?.map((c) => c!.node!);

  const classSelector = React.useRef<ItemSelector>();
  const marksForm = React.useRef<ScrollBottomSheet<any>>();
  const yearSelector = React.useRef<ItemSelector>();
  const courseSelector = React.useRef<ItemSelector>();

  React.useEffect(() => {
    if (!currentClass && classes && classes?.length) {
      setCurrentClass(classes![0]);
    }
  }, [classes]);

  const openClassSelector = () => {
    courseSelector.current?.close();
    yearSelector.current?.close();
    closeMarksForm();
    classSelector.current?.open();
  };

  const closeMarksForm = () => marksForm.current?.snapTo(2);
  const openMarksForm = () => {
    courseSelector.current?.close();
    yearSelector.current?.close();
    classSelector.current?.close();
    marksForm.current?.snapTo(1);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        classSelector.current?.close();
        closeMarksForm();
        yearSelector.current?.close();
      }}
    >
      <View
        style={{
          paddingLeft: left,
          paddingRight: right,
          paddingBottom: bottom,
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
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
                    <Icon
                      name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"}
                      size={24}
                      color="#383838"
                    />
                  </View>
                </Touchable>
                <View
                  style={{
                    paddingRight: 15,
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <KText style={{ color: "#393939", textAlign: "left", fontSize: 23 }}>
                    {t("marks")}
                  </KText>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={openClassSelector}
                  >
                    <KText style={{ marginRight: 5, color: "#393939" }}>{currentClass?.name}</KText>
                    <Ionicons name="chevron-down" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {currentClass && (
          <StudentList
            classID={currentClass.id}
            onSelect={(student) => {
              setCurrentStudent(student);
              openMarksForm();
            }}
          />
        )}

        {currentClass ? (
          <MarksForm
            ref={marksForm}
            onYearPress={() => yearSelector.current?.open()}
            currentStudent={currentStudent}
            currentClass={currentClass}
            currentYear={currentYear}
            currentCourse={currentCourse}
            onCoursePress={() => courseSelector.current?.open()}
          />
        ) : null}

        {classes ? (
          <ItemSelector
            ref={classSelector}
            data={classes.map((c) => ({ title: c.name, value: c.id, subtitle: c.stage.name }))}
            currentValue={currentClass?.id}
            onChange={(item) => {
              setCurrentClass(classes.find((c) => c.id === item.value));
              classSelector.current?.close();
            }}
          />
        ) : null}

        <ItemSelector
          ref={yearSelector}
          data={Years.map((y) => ({ title: y, value: y }))}
          currentValue={currentYear}
          onChange={(item) => {
            setCurrentYear(item.value);
          }}
        />

        <ItemSelector
          ref={courseSelector}
          data={[
            { value: Course.First, title: t("first_course") },
            { value: Course.Second, title: t("second_course") },
          ]}
          currentValue={currentCourse}
          onChange={(item) => {
            setCurrentCourse(item.value);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

interface MarksFormProps {
  currentClass: ClassMinimalFragment;
  currentStudent?: UserFragment;
  currentYear: ValueOf<typeof Years>;
  onYearPress: () => void;
  currentCourse: Course;
  onCoursePress: () => void;
}

const middlePoint = windowHeight >= 800 ? 250 : "20%";

const MarksForm = React.forwardRef(
  (
    {
      currentClass,
      currentStudent,
      currentYear,
      onYearPress,
      currentCourse,
      onCoursePress,
    }: MarksFormProps,
    ref
  ) => {
    const { top, bottom } = useSafeAreaInsets();
    const { t } = useTrans();

    const [res, refetch] = useCourseGradesQuery({
      variables: {
        classID: currentClass.id,
        studentID: currentStudent?.id,
        where: { year: currentYear?.toString(), course: currentCourse },
      },
    });

    const [, addGrade] = useAddCourseGradeMutation();
    const [, updateGrade] = useUpdateCourseGradeMutation();

    const hasGrade = !!res.data?.courseGrades.totalCount;
    const grade = res.data?.courseGrades?.edges![0];

    const [writtenFirst, setWrittenFirst] = useState<string | null | undefined>();
    const [writtenSecond, setWrittenSecond] = useState<string | null | undefined>();
    const [activityFirst, setActivityFirst] = useState<string | null | undefined>();
    const [activitySecond, setActivitySecond] = useState<string | null | undefined>();
    const [final, setFinal] = useState<string | null | undefined>();

    React.useEffect(() => {
      const n = grade?.node!;
      setWrittenFirst(n?.writtenFirst?.toString());
      setActivityFirst(n?.activityFirst?.toString());
      setWrittenSecond(n?.writtenSecond?.toString());
      setActivitySecond(n?.activitySecond?.toString());
      setFinal(n?.courseFinal?.toString());
    }, [grade?.node?.id]);

    const open = () => (ref as any).current?.snapTo(0);

    return (
      <ScrollBottomSheet<ClassMinimalFragment>
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
        }}
      >
        {currentStudent && (
          <View style={{ paddingHorizontal: 20 }}>
            <KText
              style={{ textAlign: "center", marginBottom: 15, fontSize: 18, color: "#393939" }}
            >
              {currentStudent.name}
            </KText>

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
              onPress={onYearPress}
            >
              <KText>
                {currentYear} {currentYear === thisYear ? "(" + t("current_year") + ")" : ""}
              </KText>
              <Ionicons name="chevron-down" size={15} />
            </Touchable>

            <Touchable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 15,
              }}
              onPress={onCoursePress}
            >
              <KText>{t(currentCourse === Course.First ? "first_course" : "second_course")}</KText>
              <Ionicons name="chevron-down" size={15} />
            </Touchable>

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <KText>{t("first_month")}</KText>
              <KText>{t("second_month")}</KText>
            </View>

            <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}>
              <View style={{ alignItems: "center", marginRight: 10, flex: 1 }}>
                <KText style={{ marginBottom: 5 }}>{t("a")}</KText>
                <TextInput
                  value={activityFirst?.toString()}
                  onChangeText={(v) => setActivityFirst(v)}
                  onFocus={open}
                  keyboardType="numeric"
                  style={{
                    textAlign: "center",
                    padding: 20,
                    borderRadius: 15,
                    backgroundColor: "white",
                    width: "100%",
                  }}
                />
              </View>
              <View style={{ alignItems: "center", marginRight: 10, flex: 1 }}>
                <KText style={{ marginBottom: 5 }}>{t("w")}</KText>
                <TextInput
                  value={writtenFirst?.toString()}
                  onChangeText={(v) => setWrittenFirst(v)}
                  keyboardType="numeric"
                  onFocus={open}
                  style={{
                    textAlign: "center",
                    padding: 20,
                    borderRadius: 15,
                    backgroundColor: "white",
                    width: "100%",
                  }}
                />
              </View>
              <View style={{ alignItems: "center", marginRight: 10, flex: 1 }}>
                <KText style={{ marginBottom: 5 }}>{t("a")}</KText>
                <TextInput
                  value={activitySecond?.toString()}
                  onChangeText={(v) => setActivitySecond(v)}
                  keyboardType="numeric"
                  onFocus={open}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    padding: 20,
                    borderRadius: 15,
                    backgroundColor: "white",
                  }}
                />
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <KText style={{ marginBottom: 5 }}>{t("w")}</KText>
                <TextInput
                  value={writtenSecond?.toString()}
                  onChangeText={(v) => setWrittenSecond(v)}
                  keyboardType="numeric"
                  onFocus={open}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    padding: 20,
                    borderRadius: 15,
                    backgroundColor: "white",
                  }}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
              <KText style={{ marginRight: 10 }}>
                {t("course_final")[0].toUpperCase() + t("course_final").substr(1)}
              </KText>
              <TextInput
                value={final?.toString()}
                onChangeText={(v) => setFinal(v)}
                keyboardType="numeric"
                onFocus={open}
                style={{
                  textAlign: "center",
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  backgroundColor: "white",
                }}
              />
            </View>
            <Touchable
              style={{ marginTop: 20, padding: 20, borderRadius: 20, backgroundColor: "#6862a9" }}
              onPress={async () => {
                const input = {
                  activitySecond: !Number.isNaN(parseInt(activitySecond ?? ""))
                    ? parseInt(activitySecond!)
                    : null,
                  activityFirst: !Number.isNaN(parseInt(activityFirst ?? ""))
                    ? parseInt(activityFirst!)
                    : null,
                  writtenSecond: !Number.isNaN(parseInt(writtenSecond ?? ""))
                    ? parseInt(writtenSecond!)
                    : null,
                  writtenFirst: !Number.isNaN(parseInt(writtenFirst ?? ""))
                    ? parseInt(writtenFirst!)
                    : null,
                  courseFinal: !Number.isNaN(parseInt(final ?? "")) ? parseInt(final!) : null,
                };

                if (hasGrade) {
                  const resp = await updateGrade({ id: grade?.node?.id!, input });

                  if (resp.error) {
                    showErrToast(t("something_went_wrong"));
                    return;
                  }
                } else {
                  const resp = await addGrade({
                    input: {
                      ...input,
                      classID: currentClass.id,
                      studentID: currentStudent.id,
                      course: currentCourse,
                      year: currentYear.toString(),
                    },
                  });

                  if (resp.error) {
                    showErrToast(t("something_went_wrong"));
                    return;
                  }
                }

                showSuccessToast(t("updated_successfully"));
              }}
            >
              <KText style={{ color: "#fff", textAlign: "center" }}>{t("update")}</KText>
            </Touchable>
          </View>
        )}
      </ScrollBottomSheet>
    );
  }
);

function StudentList({
  classID,
  onSelect,
}: {
  classID: string;
  onSelect: (student: UserFragment) => void;
}) {
  const after = React.useRef<string>();
  const [res, refetch] = useClassStudentsQuery({ variables: { classID, after: after.current } });
  const { t } = useTrans();

  const students = res.data?.class.stage.students?.edges?.map((s) => s!.node!);

  if (res.error) {
    return <Error msg={t("something_went_wrong")} btnText={t("retry")} onPress={refetch} />;
  }

  if (res.fetching && !res.data) {
    return <Loading />;
  }

  return students ? (
    <FlatList
      data={students}
      onEndReached={() => {
        if (!res.fetching && res.data?.class?.stage.students?.pageInfo.hasNextPage) {
          after.current = res.data?.class?.stage.students?.pageInfo.endCursor;
        }
      }}
      keyExtractor={(s) => s.id}
      ItemSeparatorComponent={() => (
        <View
          style={{
            margin: 5,
            marginHorizontal: 20,
            borderBottomColor: "#9a9a9a44",
            borderBottomWidth: 1,
          }}
        />
      )}
      renderItem={({ item }) => (
        <Touchable
          onPress={() => onSelect(item)}
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
          <Image
            source={{ uri: `${cdnURL}/${item.image}` }}
            style={{
              overflow: "hidden",
              borderRadius: 100,
              height: 40,
              width: 40,
              marginRight: 10,
            }}
          />
          <KText>{item.name}</KText>
        </Touchable>
      )}
    />
  ) : null;
}

function _StudentCourseGradesScreen() {
  const navigation = useNavigation();

  const { top, bottom, right, left } = useSafeAreaInsets();
  const { t, isRTL } = useTrans();
  const [res, refetch] = useClassesQuery();

  return (
    <View
      style={{
        paddingLeft: left,
        paddingRight: right,
        paddingBottom: bottom,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
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
                  <Icon
                    name={isRTL ? "ios-chevron-forward" : "ios-chevron-back"}
                    size={24}
                    color="#383838"
                  />
                </View>
              </Touchable>
              <View style={{ flex: 1 }}>
                <KText style={{ color: "#393939", textAlign: "left", fontSize: 23 }}>
                  {t("my_marks")}
                </KText>
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
            color={"#fff"}
            msg={t("something_went_wrong")}
            btnText={t("retry")}
          />
        ) : null}

        {res.data?.classes.edges ? (
          <FlatList
            data={res.data?.classes.edges}
            keyExtractor={(item) => item?.node?.id ?? ""}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }} />
            )}
            renderItem={({ item }) => <ClassItem item={item} />}
          />
        ) : null}
        <Loading isLoading={res.fetching} height={500} color={"#919191"} />
      </View>
    </View>
  );
}

function ClassItem({ item }: any) {
  const [showGrades, setShowGrades] = useState(false);

  return (
    <Touchable
      onPress={() => {
        setShowGrades(!showGrades);
      }}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <KText style={{ color: "#000", textAlign: "left", marginRight: 10 }}>
            {item?.node?.name}
          </KText>
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

function Grades(props: { classID: any }) {
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
        msg={t("something_went_wrong")}
        btnText={t("retry")}
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
                    {item?.node?.activityFirst +
                      item?.node?.writtenFirst +
                      item?.node?.activitySecond +
                      item?.node?.writtenSecond}
                  </KText>
                </View>
                <View>
                  <KText style={{ color: "#393939", textAlign: "center" }}>
                    {t("course_final")}
                  </KText>
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
