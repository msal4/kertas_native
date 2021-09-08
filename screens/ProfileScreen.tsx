import React from "react";
import { Touchable } from "../components/Touchable";
import { Text } from "react-native-ui-lib";
import { useTrans } from "../context/trans";
import { clearTokens } from "../util/auth";
import { RootTabScreenProps } from "../types";

export const ProfileScreen = ({ navigation }: RootTabScreenProps<"Profile">) => {
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
      <Touchable
        onPress={async () => {
          await clearTokens();
          navigation.navigate("Login");
        }}
      >
        <Text>Logout</Text>
      </Touchable>
    </>
  );
};
