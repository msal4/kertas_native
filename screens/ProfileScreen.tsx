import React, { useState } from "react";
import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import { clearTokens } from "../util/auth";
import { RootTabScreenProps } from "../types";
import { saveCurrentUser } from "../hooks/useMe";
import { useAuth } from "../context/auth";
import { replace } from "../navigation/navigationRef";
import { useProfileQuery } from "../generated/graphql";
import Loading from "../components/Loading";
import { Error } from "../components/Error";
import { View, Alert, ScrollView, Text, FlatList } from "react-native";
import { KText } from "../components/KText";
import { Image, Dialog } from "react-native-ui-lib";
import SelectModal from "../components/Select";
import { Ionicons } from "@expo/vector-icons";
import { cdnURL } from "../constants/Config";
import { Locale } from "../hooks/useLocale";

export const ProfileScreen = ({}: RootTabScreenProps<"Profile">) => {
  const { t, locale, setLocale } = useTrans();
  const { setIsAuthenticated } = useAuth();
  const [res, refetch] = useProfileQuery();
  const [showDialog, setShowDialog] = useState(false);
  
  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (res.error) {
    return (
      <Error
        onPress={() => {
          refetch();
        }}
        isError
        height={500}
        color={"#393939"}
        msg={t("حدث خطأ يرجى اعادة المحاولة")}
        btnText={t("اعد المحاولة")}
      />
    );
  }

  const stageName = res.data?.me.stage?.name;

  return (
    <>
      <Dialog
        migrate
        useSafeArea
        bottom={true}
        height={300}
        panDirection={"UP"}
        visible={showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
      >
        <View style={{ backgroundColor: "#fff", flex: 1, borderRadius: 20, overflow: "hidden", padding: 10 }}>
          {res.data?.me.stage?.payments?.edges && res.data?.me.stage?.payments?.edges?.length > 0?
          <FlatList
            data={res.data?.me.stage?.payments?.edges}
            keyExtractor={(item, index) => index + "a"}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#000", textAlign: "left" }}>
                    {item?.node?.year}
                  </Text>
                  <Text style={{ fontFamily: "Dubai-Bold", color: "#919191", textAlign: "left" }} numberOfLines={1}>
                    {numberWithCommas(item?.node?.paidAmount)}
                  </Text>
                </View>
              </View>
            )}
          />
          : null}
        </View>
      </Dialog>
      
      {!res.fetching ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              backgroundColor: "#f4f4f4",
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#e5e5e5",
              padding: 20,
            }}
          >
            <Image
              source={{ uri: `${cdnURL}/${res.data?.me.image}` }}
              width={60}
              height={60}
              style={{ backgroundColor: "#a18cd1", marginRight: 10, width: 60, height: 60 }}
              borderRadius={100}
            />
            <View>
              <KText style={{ color: "#000", textAlign: "left" }}>{res.data?.me.name}</KText>
              <KText style={{ color: "#393939", textAlign: "left" }}>
                {res.data?.me.school?.name} {stageName ? "-" : ""} {stageName}
              </KText>
            </View>
          </View>
          <ScrollView>
            <Touchable style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }}>
              <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="ios-checkmark-done-circle-outline" size={22} color="#777" />
                <KText style={{ textAlign: "left", color: "#000", paddingHorizontal: 20 }}>{t("my_marks")}</KText>
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
                <KText style={{ textAlign: "left", color: "#000", paddingHorizontal: 20 }}>{t("payments")}</KText>
              </View>
            </Touchable>
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
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                      <KText style={{ textAlign: "left", color: "#000", paddingHorizontal: 20 }}>{t("language")}</KText>
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
              style={{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }}
            >
              <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="log-out-outline" size={22} color="#777" />
                <KText style={{ textAlign: "left", color: "#000", paddingHorizontal: 20 }}>{t("logout")}</KText>
              </View>
            </Touchable>
          </ScrollView>
        </View>
      ) : null}
      <Loading isLoading={res.fetching} height={500} color={"#fff"} />
    </>
  );
};
