import { createNavigationContainerRef, StackActions } from "@react-navigation/core";
import { RootStackParamList } from "../types";

export const navigationRef = createNavigationContainerRef();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}

export function replace<RouteName extends keyof RootStackParamList>(name: RouteName, params?: RootStackParamList[RouteName]) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}
