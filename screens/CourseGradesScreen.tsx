import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, StatusBar, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";
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
} from "../generated/graphql";
import { useMe } from "../hooks/useMe";
import { useNavigation } from "@react-navigation/native";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import Years from "../constants/Years";
import { ItemSelector } from "../components/ItemSelector";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import getCurrentYear from "../util/getCurrentYear";

export default function CourseGradesScreen() {
  const { me } = useMe();
  if (!me) return null;

  return me?.role === Role.Teacher ? <_TeacherCourseGradesScreen /> : <_StudentCourseGradesScreen />;
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

  const classes = classesRes.data?.classes.edges?.map((c) => c!.node!);

  const classSelector = React.useRef<ScrollBottomSheet<ClassMinimalFragment>>();
  const marksForm = React.useRef<ScrollBottomSheet<any>>();
  const yearSelector = React.useRef<ItemSelector>();

  React.useEffect(() => {
    if (!currentClass && classes && classes?.length) {
      setCurrentClass(classes![0]);
    }
  }, [classes]);

  const closeClassSelector = () => classSelector.current?.snapTo(2);
  const openClassSelector = () => {
    closeMarksForm();
    classSelector.current?.snapTo(1);
  };

  const closeMarksForm = () => marksForm.current?.snapTo(2);
  const openMarksForm = () => {
    closeClassSelector();
    marksForm.current?.snapTo(1);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        closeClassSelector();
        closeMarksForm();
        yearSelector.current?.close();
      }}
    >
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
                <View style={{ paddingRight: 15, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <KText style={{ color: "#393939", textAlign: "left", fontSize: 23 }}>{t("marks")}</KText>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={openClassSelector}>
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
          />
        ) : null}

        {classes ? (
          <ClassSelector
            ref={classSelector}
            classes={classes}
            currentClass={currentClass}
            onChange={(item) => {
              setCurrentClass(item);
              closeClassSelector();
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
      </View>
    </TouchableWithoutFeedback>
  );
}

interface MarksFormProps {
  currentClass: ClassMinimalFragment;
  currentStudent?: UserFragment;
  currentYear?: ValueOf<typeof Years>;
  onYearPress: () => void;
}

const MarksForm = React.forwardRef(({ currentClass, currentYear, onYearPress, currentStudent }: MarksFormProps, ref) => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTrans();

  return (
    <ScrollBottomSheet<ClassMinimalFragment>
      ref={ref as any}
      componentType="ScrollView"
      snapPoints={[top, "50%", windowHeight]}
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
          <KText style={{ textAlign: "center", marginBottom: 15, fontSize: 18, color: "#393939" }}>{currentStudent.name}</KText>

          <Touchable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
            }}
            onPress={onYearPress}
          >
            <KText>{currentYear ?? t("current_year")}</KText>
            <Ionicons name="chevron-down" size={15} />
          </Touchable>
        </View>
      )}
    </ScrollBottomSheet>
  );
});

interface ClassSelectorProps {
  classes: ClassMinimalFragment[];
  currentClass?: ClassMinimalFragment;
  onChange?: (cls: ClassMinimalFragment) => void;
}

const ClassSelector = React.forwardRef(({ classes, currentClass, onChange }: ClassSelectorProps, ref) => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollBottomSheet<ClassMinimalFragment>
      ref={ref as any}
      componentType="FlatList"
      snapPoints={[top, "50%", windowHeight]}
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
      data={classes}
      keyExtractor={(c) => c?.id || ""}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      renderItem={({ item }: any) => {
        const isSelected = currentClass?.id === item.id;
        return (
          <Touchable
            style={{
              flexDirection: "row",
              padding: 20,
              backgroundColor: isSelected ? "#a18cd1" : "white",
              alignItems: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              onChange && onChange(item);
            }}
          >
            <KText numberOfLines={1} style={{ color: isSelected ? "#fff" : undefined, flex: 1, marginRight: 5 }}>
              {item.name}
            </KText>
            <KText style={{ color: isSelected ? "#f4f4f4" : "#9a9a9a" }}>{item.stage.name}</KText>
          </Touchable>
        );
      }}
      contentContainerStyle={{ backgroundColor: "#f4f4f4", padding: 16 }}
    />
  );
});

function StudentList({ classID, onSelect }: { classID: string; onSelect: (student: UserFragment) => void }) {
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
        <View style={{ margin: 5, marginHorizontal: 20, borderBottomColor: "#9a9a9a44", borderBottomWidth: 1 }} />
      )}
      renderItem={({ item }) => (
        <Touchable onPress={() => onSelect(item)} style={{ padding: 20 }}>
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
            ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }} />}
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
