import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import DashboardScreen from "../screens/app/DashboardScreen";
import ApplyLeaveScreen from "../screens/app/ApplyLeaveScreen";
import GanttScreen from "../screens/app/GanttScreen";


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
       
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
           headerShown: false,
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
          headerShown: false,
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
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="chart-gantt" color={color} size={size} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}
