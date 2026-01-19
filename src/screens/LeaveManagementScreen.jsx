import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LeaveManagementScreen({ auth }) {
  const { user } = auth;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Management</Text>
      <Text style={styles.subtitle}>
        Here you can show leave balance, apply leave, leave history, etc.
      </Text>

      <Text style={styles.userText}>Logged in as: {user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 24 },
  userText: { fontSize: 14, fontWeight: "500" },
});
