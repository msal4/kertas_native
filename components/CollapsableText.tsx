import React, { useState } from "react";
import { TextProps, TouchableOpacity } from "react-native";
import { KText } from "./KText";

export const CollapsableText: React.FC<TextProps> = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
      <KText style={{ textAlign: "left" }} numberOfLines={collapsed ? 1 : undefined} {...props} />
    </TouchableOpacity>
  );
};
