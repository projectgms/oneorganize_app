import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTheme } from "react-native-paper";

import DashboardScreen from "../screens/app/DashboardScreen";
import ApplyLeaveScreen from "../screens/app/ApplyLeaveScreen";
import GanttScreen from "../screens/app/GanttScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const theme = useTheme();
  const brandPrimary =
    useSelector((s) => s.auth.brandSettings?.primary_color) || theme.colors.primary;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: brandPrimary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ApplyLeave"
        component={ApplyLeaveScreen}
        options={{
          title: "Apply Leave",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-plus" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Gantt"
        component={GanttScreen}
        options={{
          title: "Gantt",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-gantt" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
