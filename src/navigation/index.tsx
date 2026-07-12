import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

import HomeScreen from "@/screens/HomeScreen";
import MapScreen from "@/screens/MapScreen";
import ChatScreen from "@/screens/ChatScreen";
import CropsScreen from "@/screens/CropsScreen";
import SettingsScreen from "@/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.accent,
    text: colors.textPrimary,
  },
};

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "planet",
  Map: "map",
  "Twin AI": "sparkles",
  Agriculture: "leaf",
  Settings: "settings",
};

export default function Navigation() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ICONS[route.name] ?? "ellipse"} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Twin AI" component={ChatScreen} />
        <Tab.Screen name="Agriculture" component={CropsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
