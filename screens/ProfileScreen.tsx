import React from "react";
import { Touchable } from "../components/Touchable";
import i18n from "i18n-js";
import { Text } from "react-native-ui-lib";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import { useTrans } from "../context/trans";
import { useAuth } from "../context/auth";
import { clearTokens } from "../util/auth";
import { navigationRef } from "../navigation/navigationRef";

export const ProfileScreen = ({ navigation }) => {
  const { locale, setLocale } = useTrans();
  const { logout } = useAuth();

  return (
    <>
      <Touchable
        onPress={() => {
          setLocale(locale === "ar" ? "en" : "ar");
        }}
      >
        <Text>change locale</Text>
      </Touchable>
      <Touchable
        onPress={async () => {
          await clearTokens();
          navigation.replace('Login');
        }}
      >
        <Text>logout</Text>
      </Touchable>
    </>
  );
};
