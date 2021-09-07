import AsyncStorage from "@react-native-async-storage/async-storage";
import Localization from "expo-localization";
import { useEffect, useState } from "react";

export type Locale = "en" | "ar";

export const localeKey = "locale";

export function useLocale() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [loading, setLoading] = useState(true);

  const _init = async () => {
    setLoading(true);

    const l = await AsyncStorage.getItem(localeKey);
    const currentLocale = l ? l : Localization.locale;
    if (currentLocale === "ar" || currentLocale === "en") {
      setLocale(currentLocale as Locale);
    }

    setLoading(false);
  };

  useEffect(() => {
    _init();
  }, []);

  return { locale, loading };
}
