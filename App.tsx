import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as GraphQLProvider } from "urql";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { client } from "./util/auth";
import "dayjs/locale/ar";

let customFonts = {
  "Dubai-Regular": require("./assets/fonts/DubaiW23-Regular.ttf"),
  "Dubai-Medium": require("./assets/fonts/DubaiW23-Medium.ttf"),
  "Dubai-Light": require("./assets/fonts/DubaiW23-Light.ttf"),
  "Dubai-Bold": require("./assets/fonts/DubaiW23-Bold.ttf"),
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = Font.useFonts(customFonts);

  if (!isLoadingComplete || !fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <GraphQLProvider value={client}>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    </GraphQLProvider>
  );
}
