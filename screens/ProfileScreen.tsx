import React from "react";
import { Touchable } from "../components/Touchable";
import { Text } from "react-native-ui-lib";
import { useTrans } from "../context/trans";
import { clearTokens } from "../util/auth";
import { RootTabScreenProps } from "../types";
import { saveCurrentUser } from "../hooks/useMe";
import { useAuth } from "../context/auth";
import { replace } from "../navigation/navigationRef";

export const ProfileScreen = ({ navigation }: RootTabScreenProps<"Profile">) => {
  const { locale, setLocale } = useTrans();
  const { setIsAuthenticated } = useAuth();

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
          await saveCurrentUser(null);
          setIsAuthenticated(false);
          replace("Login");
        }}
      >
        <Text>Logout</Text>
      </Touchable>
    </>
  );
};
