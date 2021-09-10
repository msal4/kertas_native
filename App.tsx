import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as GraphQLProvider } from "urql";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { createAuthClient } from "./util/auth";
import { TransProvider } from "./context/trans";
import { useLocale } from "./hooks/useLocale";
import { TextProps, ThemeManager } from "react-native-ui-lib";
import dayjs from "dayjs";
import "dayjs/locale/ar-iq";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthProvider, useAuth } from "./context/auth";

dayjs.extend(relativeTime);

let customFonts = {
  "Dubai-Regular": require("./assets/fonts/DubaiW23-Regular.ttf"),
  "Dubai-Medium": require("./assets/fonts/DubaiW23-Medium.ttf"),
  "Dubai-Light": require("./assets/fonts/DubaiW23-Light.ttf"),
  "Dubai-Bold": require("./assets/fonts/DubaiW23-Bold.ttf"),
};

ThemeManager.setComponentTheme("Text", (props: TextProps) => {
  const newProps = {
    ...(props ?? {}),
    style: [
      props.style,
      {
        fontFamily: "Dubai-Bold",
      },
    ],
  };

  return newProps;
});

export default function App() {
  return (
    <AuthProvider>
      <_App />
    </AuthProvider>
  );
}

function _App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = Font.useFonts(customFonts);
  const { locale, loading: localeLoading } = useLocale();
  const { isAuthenticated } = useAuth();
  const client = useMemo(createAuthClient, [isAuthenticated]);

  if (!isLoadingComplete || !fontsLoaded || localeLoading) {
    return <AppLoading />;
  }

  return (
    <TransProvider locale={locale}>
      <GraphQLProvider value={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </GraphQLProvider>
    </TransProvider>
  );
}
