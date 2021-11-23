import React, { useState } from "react";
import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import { clearTokens } from "../util/auth";
import { RootTabScreenProps } from "../types";
import { saveCurrentUser } from "../hooks/useMe";
import { useAuth } from "../context/auth";
import { replace } from "../navigation/navigationRef";
import { Role, useProfileQuery } from "../generated/graphql";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import { View, Alert, ScrollView, Text, FlatList } from "react-native";
import { KText } from "../components/KText";
import { Image, Dialog, PanningProvider } from "react-native-ui-lib";
import SelectModal from "../components/Select";
import { Ionicons } from "@expo/vector-icons";
import { cdnURL } from "../constants/Config";
import { Locale } from "../hooks/useLocale";
import dayjs from "dayjs";

export const ProfileScreen = ({ navigation }: RootTabScreenProps<"Profile">) => {
  const { t, locale, setLocale } = useTrans();
  const { setIsAuthenticated } = useAuth();
  const [res, refetch] = useProfileQuery();
  const [showDialog, setShowDialog] = useState(false);
  const [] = useState(false);

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        color={"#393939"}
        msg={t("something_went_wrong")}
        btnText={t("retry")}
      />
    );
  }

  const stageName = res.data?.me.stage?.name;

  return (
    <>
      <Dialog
        useSafeArea
        bottom={true}
        height={300}
        panDirection={PanningProvider.Directions.DOWN}
        visible={showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
      >
        <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden" }}>
          <View
            style={{
              backgroundColor: "#f4f4f4",
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <KText style={{ fontSize: 23, color: "#393939" }}>{t("payments")}</KText>
          </View>
          {res.data?.me.stage?.payments?.edges &&
          res.data?.me.stage?.payments?.edges?.length > 0 ? (
            <FlatList
              data={res.data?.me.stage?.payments?.edges}
              keyExtractor={(item) => item?.node?.id ?? ""}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }} />
              )}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row", padding: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontFamily: "Dubai-Medium", color: "#383838", textAlign: "left" }}
                    >
                      {item?.node?.year}
                    </Text>
                    <Text
                      style={{ fontFamily: "Dubai-Regular", color: "#919191", textAlign: "left" }}
                      numberOfLines={1}
                    >
                      {numberWithCommas(item?.node?.paidAmount ?? 0)} {t("iqd")} -{" "}
                      {dayjs(item?.node?.createdAt).locale(locale).format("D - MMMM - YYYY")}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : null}
        </View>
      </Dialog>

      {!res.fetching ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              backgroundColor: "#f4f4f4",
              flexDirection: "row",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={{ uri: `${cdnURL}/${res.data?.me.image}` }}
              style={{
                backgroundColor: "#6862a9",
                marginRight: 10,
                width: 60,
                height: 60,
                borderRadius: 100,
              }}
            />
            <View>
              <KText style={{ color: "#383838", textAlign: "left" }}>{res.data?.me.name}</KText>
              <KText style={{ color: "#393939", textAlign: "left" }}>
                {res.data?.me.school?.name} {stageName ? "-" : ""} {stageName}
              </KText>
            </View>
          </View>
          <ScrollView>
            {res.data?.me.role === Role.Student ? (
              <>
                <Touchable
                  style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }}
                  onPress={() => {
                    navigation.navigate("CourseGrades");
                  }}
                >
                  <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="ios-checkmark-done-circle-outline" size={22} color="#777" />
                    <KText style={{ textAlign: "left", color: "#383838", paddingHorizontal: 20 }}>
                      {t("my_marks")}
                    </KText>
                  </View>
                </Touchable>
                <Touchable
                  style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }}
                  onPress={() => {
                    setShowDialog(true);
                  }}
                >
                  <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="card-outline" size={22} color="#777" />
                    <KText style={{ textAlign: "left", color: "#383838", paddingHorizontal: 20 }}>
                      {t("payments")}
                    </KText>
                  </View>
                </Touchable>
              </>
            ) : null}
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }}>
              <SelectModal
                data={[
                  { name: "العربية", value: "ar" },
                  { name: "English", value: "en" },
                ]}
                onSelect={({ value }) => {
                  setLocale(value as Locale);
                }}
                selected={locale}
                renderBtn={() => (
                  <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="ios-globe-outline" size={22} color="#777" />
                    <View
                      style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
                    >
                      <KText style={{ textAlign: "left", color: "#383838", paddingHorizontal: 20 }}>
                        {t("language")}
                      </KText>
                      <KText style={{ textAlign: "left", color: "#aaa", paddingHorizontal: 20 }}>
                        {locale === "ar" ? "العربية" : "English"}
                      </KText>
                    </View>
                  </View>
                )}
                initialNumToRender={7}
                height={600}
              />
            </View>
            <Touchable
              onPress={() => {
                Alert.alert(t("logout"), t("logout_msg"), [
                  { text: t("no") },
                  {
                    text: t("yes"),
                    onPress: async () => {
                      await clearTokens();
                      await saveCurrentUser(null);
                      setIsAuthenticated(false);
                      replace("Login");
                    },
                  },
                ]);
              }}
            >
              <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="log-out-outline" size={22} color="#777" />
                <KText style={{ textAlign: "left", color: "#383838", paddingHorizontal: 20 }}>
                  {t("logout")}
                </KText>
              </View>
            </Touchable>
          </ScrollView>
        </View>
      ) : null}
      <Loading isLoading={res.fetching} height={500} />
    </>
  );
};
