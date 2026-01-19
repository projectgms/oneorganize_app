import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { DrawerActions } from "@react-navigation/native";

export default function AppHeader({ navigation }) {
  const user = useSelector((s) => s.auth.user);
  const brandPrimary = useSelector((s) => s.auth.brandSettings?.primary_color) || "#1677ff";

  // if you have unread notifications later, put it in redux and replace this
  const unreadCount = useSelector((s) => s.notifications?.unreadCount || 0);

  const name = user?.name || "User";
  // you can also use designation if available. Here I use first role.
  const roleText = (user?.designation && user.designation) || "Employee";

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const openNotifications = () => {
    // ✅ If you have a Notifications screen, navigate to it.
    // navigation.navigate("Notifications");
    console.log("Open Notifications");
  };

  return (
    <View style={styles.container}>
      {/* Left: hamburger */}
      <TouchableOpacity onPress={openDrawer} style={styles.leftBtn}>
        <MaterialCommunityIcons name="menu" size={26} color="#111" />
      </TouchableOpacity>

      {/* Center: avatar + name + role */}
      <View style={styles.center}>
        <Avatar.Text
          size={38}
          label={(name?.[0] || "U").toUpperCase()}
          style={{ backgroundColor: brandPrimary }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {roleText}
          </Text>
        </View>
      </View>

      {/* Right: bell with dot */}
      <TouchableOpacity onPress={openNotifications} style={styles.rightBtn}>
        <MaterialCommunityIcons name="bell-outline" size={26} color="#111" />
        {unreadCount > 0 && <View style={[styles.dot, { backgroundColor: "#ff3b30" }]} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    marginTop:50,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  leftBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  rightBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 14, fontWeight: "700", color: "#111" },
  sub: { fontSize: 12, color: "#6b7280", marginTop: 1 },
});
