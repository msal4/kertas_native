import React from "react";
import { Touchable } from "../components/Touchable";
import i18n from "i18n-js";
import { Text } from "react-native-ui-lib";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import { useTrans } from "../context/trans";

export const ProfileScreen = () => {
  const { locale, setLocale } = useTrans();

  return (
    <>
      <Touchable
        onPress={() => {
          setLocale(locale === "ar" ? "en" : "ar");
        }}
      >
        <Text>change locale</Text>
      </Touchable>
    </>
  );
};
