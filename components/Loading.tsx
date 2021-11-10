import React from "react";
import { View } from "react-native";
import { WaveIndicator as LoadingIndicator } from "react-native-indicators";
import { primaryColor } from "../util/const";

// contract
interface LoadingProps {
  isLoading?: boolean; // boolean | undefined
  height?: number | string; // number | string | undefined
  color?: string;
}

// <Loading />
export default function Loading({
  color = primaryColor,
  isLoading = true,
  height = "auto",
}: LoadingProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height,
        flex: height === "100%" ? 1 : undefined,
      }}
    >
      <LoadingIndicator color={primaryColor} /*count={3} */ />
    </View>
  );
}
