import React from "react";
import { Alert } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import MainTabs from "./MainTabs";
import ProfileScreen from "../screens/app/ProfileScreen";
import LeaveManagementScreen from "../screens/app/LeaveManagementScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";
import AppHeader from "../components/AppHeader";

import { hasAnyPermission } from "../store/selectors/authSelectors";
import { logoutRequest } from "../store/slices/authSlice";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  const dispatch = useDispatch();
  const permissions = useSelector((s) => s.auth.permissions || []);
  const brandPrimary = useSelector((s) => s.auth.brandSettings?.primary_color) || "#1677ff";

  const canSeeLeave = hasAnyPermission(permissions, [
    "show leave",
    "manage leave",
    "create leave",
    "edit leave",
  ]);

  const onLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => dispatch(logoutRequest()) },
    ]);
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        header: (props) => <AppHeader {...props} />,   // ✅ custom header here
        drawerActiveTintColor: brandPrimary,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />

      {canSeeLeave && (
        <Drawer.Screen
          name="LeaveManagement"
          component={LeaveManagementScreen}
          options={{
            title: "Leave Management",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-text-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="ChangePasswordDrawer"
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lock-reset" color={color} size={size} />
          ),
        }}
      />

      {/* Logout drawer item */}
      <Drawer.Screen
        name="Logout"
        component={MainTabs}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            onLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
}
