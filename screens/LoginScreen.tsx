import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { RootStackScreenProps } from "../types";
import { Button, TextField, Toast, View } from "react-native-ui-lib";
import { useLoginMutation } from "../generated/graphql";
import { setTokens } from "../util/auth";
import { useAuth } from "../context/auth";
import * as Notifications from "expo-notifications";
import { isAndroid } from "../constants/platform";
import * as Constants from "expo-constants";

export default function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const [, login] = useLoginMutation();
  const [errToastVisible, setErrToastVisible] = useState(false);
  const [errToastMsg, setErrToastMsg] = useState("failed");
  const [username, setUsername] = useState("student01");
  const [password, setPassword] = useState("student01pass");
  const { setIsAuthenticated } = useAuth();

  const showErrToast = (msg?: string) => {
    if (msg) {
      setErrToastMsg(msg);
    }
    setErrToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <TextField
        value={username}
        onChangeText={setUsername}
        textContentType="username"
        autoCompleteType="username"
        autoCapitalize="none"
        title={"Username"}
        autoCorrect={false}
      />

      <TextField
        value={password}
        onChangeText={setPassword}
        textContentType="password" // ios
        autoCompleteType="password" // android
        autoCapitalize="none"
        autoCorrect={false}
        title={"Password"}
        secureTextEntry
      />

      <Button
        onPress={async () => {
          const pushToken = await registerForPushNotificationsAsync();
          const res = await login({ username, password, pushToken });

          if (res.error) {
            showErrToast("Invalid user");
            return;
          }

          await setTokens(res.data?.loginUser);
          setIsAuthenticated(true);

          navigation.navigate("Start");
        }}
        label={"LOGIN"}
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
});
