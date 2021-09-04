import React from "react";
import { View } from "react-native";
import { DotIndicator } from "react-native-indicators";

// contract
interface LoadingProps {
  isLoading?: boolean; // boolean | undefined
  height?: number | string; // number | string | undefined
  color?: string;
}

// <Loading />
export default function Loading({ color = "white", isLoading = true, height = "auto" }: LoadingProps) {
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
      }}
    >
      <DotIndicator color={color} count={3} />
    </View>
  );
}
