import React from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { Text, Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets(); // ✅ auto top padding for iOS + Android

  const user = useSelector((s) => s.auth.user);
  const brandPrimary = useSelector((s) => s.auth.brandSettings?.primary_color) || "#1677ff";
  const unreadCount = useSelector((s) => s.notifications?.unreadCount || 0);

  const name = user?.name || "User";
  const roleText = user?.designation || "Employee";

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top, // ✅ automatic
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.container}>
        <Pressable onPress={openDrawer} style={styles.iconBtn} android_ripple={{ color: "#00000015" }}>
          <MaterialCommunityIcons name="menu" size={26} color={theme.colors.onSurface} />
        </Pressable>

        <View style={styles.center}>
          <Avatar.Text
            size={38}
            label={(name?.[0] || "U").toUpperCase()}
            style={{ backgroundColor: brandPrimary }}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.name, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.sub, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
              {roleText}
            </Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <Pressable style={styles.iconBtn} android_ripple={{ color: "#00000015" }}>
            <View style={{ position: "relative" }}>
              <MaterialCommunityIcons name="bell-outline" size={26} color={theme.colors.onSurface} />
              {unreadCount > 0 && (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: "#ff3b30", borderColor: theme.colors.surface },
                  ]}
                />
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  container: {
    height: 56, // header content height (safe area is added above)
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  name: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 12, marginTop: 1 },
});
