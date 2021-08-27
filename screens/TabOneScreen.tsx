import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useClassesQuery } from "../generated/graphql";
import { Button } from "react-native-ui-lib";
import { getAccessToken } from "../util/auth";

export default function TabOneScreen({ navigation }: RootTabScreenProps<"TabOne">) {
  const [res, refresh] = useClassesQuery();

  if (res.fetching) {
    return <Text>Loading...</Text>;
  }

  if (res.error) {
    return <Text>{res.error.toString()}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{res.data?.classes?.totalCount}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button
        label={"get classes"}
        onPress={async () => {
          console.log("i am refreshed");
          const token = await getAccessToken();
          refresh({ fetchOptions: token ? { headers: { Authorization: token } } : undefined, requestPolicy: "network-only" });
        }}
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
