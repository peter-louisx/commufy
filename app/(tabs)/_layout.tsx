import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Icons from "@/components/icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarHideOnKeyboard: true,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            height: 70,
            shadowColor: "transparent",
            borderTopWidth: 0,
          },
        }),
        tabBarItemStyle: {
          paddingVertical: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icons.Home size={36} color={color} />,
          tabBarIconStyle: {
            marginBottom: 5,
          },
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: "MuRoute",
          tabBarIcon: ({ color }) => <Icons.MuRoute size={36} color={color} />,
          tabBarIconStyle: {
            marginBottom: 3,
          },
        }}
      />
      <Tabs.Screen
        name="live-track"
        options={{
          title: "Live Track",
          tabBarIcon: ({ color }) => <Icons.Map size={36} color={color} />,
          tabBarIconStyle: {
            marginBottom: 3,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Icons.User size={36} color={color} />,
          tabBarIconStyle: {
            marginBottom: 3,
          },
        }}
      />
    </Tabs>
  );
}
