import React from "react";
import { View } from "react-native";
import { PacmanIndicator } from "react-native-indicators";

// contract
interface LoadingProps {
  isLoading?: boolean; // boolean | undefined
  height?: number | string; // number | string | undefined
  color?: string;
}

// <Loading />
export default function Loading({ color = "#9b9b9b", isLoading = true, height = "auto" }: LoadingProps) {
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
      <PacmanIndicator color={color} /*count={3} */ />
    </View>
  );
}
