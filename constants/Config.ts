import Constants from "expo-constants";
import { Platform } from "react-native";

export const graphqlURL =
  Constants.manifest?.extra?.graphqlURL ||
  Platform.select({
    ios: "http://localhost:3000/graphql",
    android: "http://10.0.2.2:3000/graphql",
  })!;

export const cdnURL =
  Constants.manifest?.extra?.cdnURL ||
  Platform.select({ ios: "http://localhost:9000/root", android: "http://10.0.2.2:9000/root" })!;
