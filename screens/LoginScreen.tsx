import * as React from "react";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { RootStackScreenProps } from "../types";
import { View } from "react-native-ui-lib";
import { useLoginMutation } from "../generated/graphql";
import { setTokens } from "../util/auth";
import { useAuth } from "../context/auth";
import * as Notifications from "expo-notifications";
import { isAndroid, isIOS } from "../constants/platform";
import * as Constants from "expo-constants";

import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import { showErrToast } from "../util/toast";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const [, login] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const { t, isRTL } = useTrans();
  const passwordInput = React.useRef<TextInput>();
  const { top, right, bottom, left } = useSafeAreaInsets();
  const [fetching, setFetching] = useState(false);

  const loginUser = async () => {
    setFetching(true);
    let pushToken: string | undefined;
    try {
      pushToken = await registerForPushNotificationsAsync();
    } catch (e) {
      showErrToast(t("something_went_wrong"));
    }

    const res = await login({ username, password, pushToken });

    if (res.error) {
      setFetching(false);
      let err = t("something_went_wrong");
      if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "INVALID_CREDS")) {
        err = t("invalid_credentials");
      } else if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "NOT_FOUND")) {
        err = t("user_not_found");
      } else if (res.error?.graphQLErrors?.some((e) => e.extensions?.code === "NOT_ALLOWED")) {
        err = t("user_not_allowed");
      }

      showErrToast(err);

      return;
    }

    await setTokens(res.data?.loginUser);
    setIsAuthenticated(true);
    setFetching(false);

    navigation.navigate("Start");
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={isIOS ? "padding" : undefined}
          style={{
            justifyContent: "center",
            paddingTop: top,
            paddingRight: right + 20,
            paddingBottom: bottom,
            paddingLeft: left + 20,
            flex: 1,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: "100%",
              height: 200,
              alignSelf: "center",
              marginBottom: 30,
            }}
            source={require("../assets/images/Kertas-01.png")}
          />
          <View>
            <KText style={{ paddingHorizontal: 20, marginBottom: 5, textAlign: "left" }}>
              {t("username")}
            </KText>
            <TextInput
              value={username}
              onChangeText={setUsername}
              textContentType="username"
              autoCompleteType="username"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                backgroundColor: "#f4f4f4",
                paddingVertical: 20,
                paddingHorizontal: 25,
                borderWidth: 2,
                borderColor: userFocus ? "#6862a9" : "#f4f4f4",
                fontSize: 16,
                borderRadius: 100,
                textAlign: isRTL ? "right" : "left",
                color: "#393939",
              }}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              placeholder={t("enter_your_username")}
              placeholderTextColor="#39393944"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInput.current?.focus();
              }}
            />
          </View>

          <View>
            <KText
              style={{ paddingHorizontal: 20, marginBottom: 5, marginTop: 30, textAlign: "left" }}
            >
              {t("password")}
            </KText>
            <TextInput
              ref={passwordInput as any}
              value={password}
              onChangeText={setPassword}
              textContentType="password" // ios
              autoCompleteType="password" // android
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              placeholder={t("enter_your_password")}
              placeholderTextColor="#39393944"
              style={{
                backgroundColor: "#f4f4f4",
                paddingVertical: 20,
                paddingHorizontal: 25,
                borderWidth: 2,
                borderColor: passFocus ? "#6862a9" : "#f4f4f4",
                fontSize: 16,
                borderRadius: 100,
                textAlign: isRTL ? "right" : "left",
                color: "#393939",
              }}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              returnKeyType="join"
              onSubmitEditing={loginUser}
            />
          </View>

          <Touchable
            style={{
              borderRadius: 100,
              overflow: "hidden",
              marginTop: 60,
              backgroundColor: fetching ? "#39393944" : "#6862a9",
              padding: fetching || Platform.OS === "android" ? 10 : 0,
            }}
            disabled={fetching}
            onPress={loginUser}
          >
            {!fetching && Platform.OS === "ios" ? (
              <LinearGradient
                style={{
                  overflow: "hidden",
                  padding: 10,
                }}
                colors={["#5bb0d6", "#6862a9"]}
                start={{ x: 0, y: 0 }}
              >
                <KText
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  {t("login")}
                </KText>
              </LinearGradient>
            ) : (
              <KText
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 18,
                }}
              >
                {t("login")}
              </KText>
            )}
          </Touchable>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.default.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (isAndroid) {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
