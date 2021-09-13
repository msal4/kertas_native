/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Text, Platform } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import LoginScreen from "../screens/LoginScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import AssignmentsScreen from "../screens/AssignmentsScreen";
import CourseGradesScreen from "../screens/CourseGradesScreen";
import HomeScreen from "../screens/HomeScreen";
import { RootStackParamList, RootStackScreenProps, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { StartScreen } from "../screens/StartScreen";
import { navigationRef } from "./navigationRef";
import { ProfileScreen } from "../screens/ProfileScreen";
import { useTrans } from "../context/trans";
import { ChatScreen } from "../screens/ChatScreen";
import { ConversationScreen } from "../screens/ConversationScreen";
import { View } from "react-native-ui-lib";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KText } from "../components/KText";
import { Touchable } from "../components/Touchable";

import HomeIcon from "../assets/icons/Home.svg";
import HomeActiveIcon from "../assets/icons/Home-Active.svg";
import ChatIcon from "../assets/icons/Chat.svg";
import ChatActiveIcon from "../assets/icons/Chat-Active.svg";
import NotificationIcon from "../assets/icons/Notification.svg";
import NotificationActiveIcon from "../assets/icons/Notification-Active.svg";
import ProfileIcon from "../assets/icons/Profile.svg";
import ProfileActiveIcon from "../assets/icons/Profile-Active.svg";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer ref={navigationRef} linking={LinkingConfiguration} theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Start">
      <Stack.Screen name="Start" component={StartScreen} options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Root" component={RootScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}
      />
      <Stack.Screen name="Assignments" options={{ headerShown: false }} component={AssignmentsScreen} />
      <Stack.Screen name="CourseGrades" options={{ headerShown: false }} component={CourseGradesScreen} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function TabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTrans();

  return (
    <View
      style={{
        backgroundColor: "#f4f4f4",
        flexDirection: "row",
        paddingBottom: Platform.OS == "ios" ? 15 : 0,
        height: 80,
        borderTopWidth: 2,
        borderTopColor: "#9a9a9a11",
      }}
    >
      <View style={{ flex: 1 }}>
        <Touchable
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            {state.index === 0 ? (
              <HomeActiveIcon width={28} height={28} fill="#a18cd1" />
            ) : (
              <HomeIcon width={28} height={28} stroke="#8e8e8e" />
            )}
            <Text style={{ fontFamily: "Dubai-Regular", color: state.index === 0 ? "#a18cd1" : "#9a9a9a", fontSize: 13 }}>{t("home")}</Text>
          </View>
        </Touchable>
      </View>
      <View style={{ flex: 1 }}>
        <Touchable
          onPress={() => {
            navigation.navigate("Chat");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            {state.index === 1 ? (
              <ChatActiveIcon width={28} height={28} fill="#a18cd1" />
            ) : (
              <ChatIcon width={28} height={28} fill="#8e8e8e" />
            )}
            <Text style={{ fontFamily: "Dubai-Regular", color: state.index === 1 ? "#a18cd1" : "#9a9a9a", fontSize: 13 }}>{t("chat")}</Text>
          </View>
        </Touchable>
      </View>
      <View style={{ flex: 1 }}>
        <Touchable
          onPress={() => {
            navigation.navigate("Notifications");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            {state.index === 2 ? (
              <NotificationActiveIcon width={28} height={28} fill="#a18cd1" />
            ) : (
              <NotificationIcon width={28} height={28} fill="#8e8e8e" />
            )}
            <Text style={{ fontFamily: "Dubai-Regular", color: state.index === 2 ? "#a18cd1" : "#9a9a9a", fontSize: 13 }}>
              {t("notifications")}
            </Text>
          </View>
        </Touchable>
      </View>
      <View style={{ flex: 1 }}>
        <Touchable
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
            {state.index === 3 ? (
              <ProfileActiveIcon width={28} height={28} fill="#a18cd1" />
            ) : (
              <ProfileIcon width={28} height={28} fill="#8e8e8e" />
            )}
            <Text style={{ fontFamily: "Dubai-Regular", color: state.index === 3 ? "#a18cd1" : "#9a9a9a", fontSize: 13 }}>
              {t("my_profile")}
            </Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
}

function RootScreen({}: RootStackScreenProps<"Root">) {
  const colorScheme = useColorScheme();
  const { t } = useTrans();
  const { top, right, left } = useSafeAreaInsets();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarLabelStyle: {
          fontFamily: "Dubai-Light",
          fontSize: 13,
        },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t("chat"),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          header: () => (
            <View row style={{ paddingTop: top, paddingRight: right + 20, paddingLeft: left + 20 }}>
              <KText style={{ fontSize: 23, color: "#393939" }}>{t("chat")}</KText>
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: t("notifications"),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          header: () => (
            <View row style={{ paddingTop: top, paddingRight: right + 20, paddingLeft: left + 20 }}>
              <KText style={{ fontSize: 23, color: "#393939" }}>{t("notifications")}</KText>
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("my_profile"),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          header: () => (
            <View row style={{ backgroundColor: "#f4f4f4", paddingTop: top, paddingRight: right + 20, paddingLeft: left + 20 }}>
              <KText style={{ fontSize: 23, color: "#393939" }}>{t("my_profile")}</KText>
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
