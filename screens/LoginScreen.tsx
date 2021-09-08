import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { RootStackScreenProps } from "../types";
import { Button, TextField, Toast, View } from "react-native-ui-lib";
import { useLoginMutation } from "../generated/graphql";
import { setTokens } from "../util/auth";

export default function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const [, login] = useLoginMutation();
  const [errToastVisible, setErrToastVisible] = useState(false);
  const [errToastMsg, setErrToastMsg] = useState("failed");
  const [username, setUsername] = useState("student01");
  const [password, setPassword] = useState("student01pass");

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
          const res = await login({ username, password });

          if (res.error) {
            showErrToast("Invalid user");
            return;
          }

          await setTokens(res.data?.loginUser);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
});
