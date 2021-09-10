import React, { createContext, FC, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Locale } from "../hooks/useLocale";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import dayjs from "dayjs";

const trans = {
  ar: require("../assets/langs/ar.json"),
  en: require("../assets/langs/en.json"),
};

const TransContext = createContext<{
  t: (term: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => Promise<void> | void;
  isRTL: boolean;
}>({
  t: (term) => term,
  locale: "ar",
  setLocale: () => {},
  isRTL: false,
});

export const TransProvider: FC<{ locale: Locale }> = ({ locale: l, children }) => {
  const [locale, setLocale] = useState<Locale>(l);

  useEffect(() => {
    dayjs.locale(locale === "ar" ? "ar-iq" : "en");

    if (locale === "ar" && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      Updates.reloadAsync();
    } else if (locale === "en" && I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      Updates.reloadAsync();
    }
  }, [locale]);

  const changeLocale = async (l: Locale) => {
    await AsyncStorage.setItem("locale", l);
    setLocale(l);
  };

  const t = (term: string): string => {
    return trans[locale][term] || term;
  };

  return <TransContext.Provider value={{ locale, setLocale: changeLocale, t, isRTL: locale === "ar" }}>{children}</TransContext.Provider>;
};

export const useTrans = () => useContext(TransContext);
