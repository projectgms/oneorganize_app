import React from "react";
import { Alert, View, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem, // ✅ ADD
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MainTabs from "./MainTabs";
import ProfileScreen from "../screens/app/ProfileScreen";
import LeaveManagementScreen from "../screens/app/LeaveManagementScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";
import AppearanceScreen from "../screens/app/AppearanceScreen";
import AppHeader from "../components/AppHeader";
import NotificationScreen from "../screens/app/NotificationScreen";


import { hasAnyPermission } from "../store/selectors/authSelectors";
import { logoutRequest } from "../store/slices/authSlice";
import OneOrganizeLogo from "./../../assets/adaptive-icon.png";
import OneOrganizeLogoWhite from "./../../assets/one-organize-white-logo.png";
import LeaveStatusScreen from './../screens/app/LeaveStatusScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ onLogout, ...props }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const isDarkMode = theme.dark; 

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      {/* ✅ Scrollable area (logo + items) */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            marginHorizontal: 12,
            marginBottom: 12,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.surface,
          }}
        >
          <Image
            source={isDarkMode ? OneOrganizeLogoWhite : OneOrganizeLogo}
            style={{ width: 120, height: 60 }}
            resizeMode="contain"
          />
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* ✅ Fixed bottom Logout */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
        }}
      >
        <DrawerItem
          label="Logout"
          inactiveTintColor={theme.colors.onSurfaceVariant}
          icon={({ size }) => (
            <MaterialCommunityIcons
              name="logout"
              size={size}
              color={theme.colors.onSurfaceVariant}
            />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            onLogout();
          }}
        />
      </View>
    </View>
  );
}

export default function AppDrawer() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const permissions = useSelector((s) => s.auth.permissions || []);
  const brandPrimary =
    useSelector((s) => s.auth.brandSettings?.primary_color) ||
    theme.colors.primary;

  const canSeeLeave = hasAnyPermission(permissions, [
    // "show leave",
    // "manage leave",
    // "create leave",
    "edit leave",
  ]);

  const onLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(logoutRequest()),
      },
    ]);
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        drawerActiveTintColor: brandPrimary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerStyle: { backgroundColor: theme.colors.surface },
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("Home", { screen: "Dashboard" });
          },
        })}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
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
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}


      {!canSeeLeave &&  <Drawer.Screen
          name="LeaveStatus"
          component={LeaveStatusScreen}
          options={{
            title: "Leave Status",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />}

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

      <Drawer.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{
          title: "Appearance",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="theme-light-dark"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
