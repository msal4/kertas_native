import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as GraphQLProvider } from "urql";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { client } from "./util/auth";

let customFonts = {
  "Dubai-Regular": require("./assets/fonts/DubaiW23-Regular.ttf"),
  "Dubai-Medium": require("./assets/fonts/DubaiW23-Medium.ttf"),
  "Dubai-Light": require("./assets/fonts/DubaiW23-Light.ttf"),
  "Dubai-Bold": require("./assets/fonts/DubaiW23-Bold.ttf"),
};

const langs = {
  ar: require("./lang/ar.json"),
  en: require("./lang/en.json"),
};

export default function App() {
  const [getFontsLoaded, setFontsLoaded] = useState(false);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [lang, setLocale] = useState("ar");

  useEffect(() => {
    if (I18nManager.isRTL == false && lang == "ar") {
      Updates.reloadAsync();
    }
  });

  useEffect(() => {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    loadFontsAsync();
  });

  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  const t = (scope, options) => {
    var name = "";
    if (options != undefined && options.name != undefined) {
      name = options.name;
    }
    return langs[lang][scope] != undefined ? (name != "" ? langs[lang][scope].replace("%{name}", name) : langs[lang][scope]) : scope;
  };

  const screenProps = {
    t: t,
    setLocale: setLocale,
    color: {
      main: "",
    },
  };

  if (!isLoadingComplete || !getFontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <GraphQLProvider value={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} screenProps={screenProps} />
          <StatusBar />
        </SafeAreaProvider>
      </GraphQLProvider>
    );
  }
}
