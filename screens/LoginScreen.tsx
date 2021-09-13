import * as React from "react";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { RootStackScreenProps } from "../types";
import { Button, TextField, Toast, View } from "react-native-ui-lib";
import { useLoginMutation } from "../generated/graphql";
import { setTokens } from "../util/auth";
import { useAuth } from "../context/auth";
import * as Notifications from "expo-notifications";
import { isAndroid } from "../constants/platform";
import * as Constants from "expo-constants";

import { Touchable } from "../components/Touchable";
import { useTrans } from "../context/trans";
import { KText } from "../components/KText";

export default function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const [, login] = useLoginMutation();
  const [errToastVisible, setErrToastVisible] = useState(false);
  const [errToastMsg, setErrToastMsg] = useState("failed");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const { t, locale, isRTL } = useTrans();

  const showErrToast = (msg?: string) => {
    if (msg) {
      setErrToastMsg(msg);
    }
    setErrToastVisible(true);
  };

  let userPassInput = null;

  const loginUser =  async () => {
    const pushToken = await registerForPushNotificationsAsync();
    const res = await login({ username, password, pushToken });

    if (res.error) {
      showErrToast("Invalid user");
      return;
    }

    await setTokens(res.data?.loginUser);
    setIsAuthenticated(true);

    navigation.navigate("Start");
  }

  return (
    <View style={{
      backgroundColor: '#f4f4f4',
      flex: 1,
      justifyContent: 'center',
      padding: 30
    }}>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
        <View style={{ width: 150, height: 150, borderRadius: 500, backgroundColor: '#fff', borderWidth: 1, borderColor: '#a18cd1', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <KText style={{ fontFamily: 'Dubai-Bold', color: '#a18cd1' }}>LOGO</KText>
        </View>
      </View>

      <KText style={{ paddingHorizontal: 20, marginBottom: 5, textAlign: 'left' }}>{t("username")}</KText>
      <TextInput
        value={username}
        onChangeText={setUsername}
        textContentType="username"
        autoCompleteType="username"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          backgroundColor: '#fff',
          padding: 15,
          paddingHorizontal: 20,
          borderWidth: 2,
          borderColor: userFocus? '#a18cd1': '#ddd',
          fontSize: 16,
          borderRadius: 100,
          textAlign: isRTL? 'right': 'left',
          color: '#393939'
        }}
        onFocus={() => setUserFocus(true)}
        onBlur={() => setUserFocus(false)}
        returnKeyType="next"
        onSubmitEditing={() => {
          userPassInput.focus();
        }}
      />

      <KText style={{ paddingHorizontal: 20, marginBottom: 5, marginTop: 30, textAlign: 'left' }}>{t("password")}</KText>
      <TextInput
        ref={r => userPassInput = r}
        value={password}
        onChangeText={setPassword}
        textContentType="password" // ios
        autoCompleteType="password" // android
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        style={{
          backgroundColor: '#fff',
          padding: 15,
          paddingHorizontal: 20,
          borderWidth: 2,
          borderColor: passFocus? '#a18cd1': '#ddd',
          fontSize: 16,
          borderRadius: 100,
          textAlign: isRTL? 'right': 'left',
          color: '#393939'
        }}
        onFocus={() => setPassFocus(true)}
        onBlur={() => setPassFocus(false)}
        returnKeyType='go'
        onSubmitEditing={loginUser}
      />

      <View style={{ borderRadius: 100, overflow: 'hidden', marginTop: 60 }}>
        <Touchable
          onPress={loginUser}
        >
          <View style={{ padding: 10, backgroundColor: '#a18cd1' }}>
            <KText style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>{t("login")}</KText>
          </View>
        </Touchable>
      </View>

      <Toast
        visible={errToastVisible}
        position={"top"}
        backgroundColor={"red"}
        message={errToastMsg}
        onDismiss={() => setErrToastVisible(false)}
        autoDismiss={3000}
      />
    </View>
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
