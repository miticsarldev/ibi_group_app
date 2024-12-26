import { Tabs } from "expo-router";
import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderRadius: 50,
          paddingBottom: 25, // ios only
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                borderRadius: 9999,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#52D5BA" : "#333333",
                borderWidth: focused ? 2 : 0,
                borderColor: "#52D5BA",
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={focused ? "#333333" : "#52D5BA"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 9999,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#52D5BA" : "#333333",
                borderWidth: focused ? 2 : 0,
                borderColor: "#52D5BA",
              }}
            >
              <Ionicons
                name={focused ? "car-sport" : "car-sport-outline"}
                size={24}
                color={focused ? "#333333" : "#52D5BA"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
