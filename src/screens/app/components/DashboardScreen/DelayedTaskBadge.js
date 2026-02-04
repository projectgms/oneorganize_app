import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Delayed Task Badge: Triggers only on 'Delay' status
 */
export const DelayedTaskBadge = ({ status }) => {
  const theme = useTheme();

  if (status?.toLowerCase() !== "delay") return null;

  return (
    <View
      style={[
        styles.badgeBase,
        {
          backgroundColor: theme.dark ? "rgba(255, 152, 0, 0.15)" : "#FFF3E0",
          borderColor: "#FFB74D",
        },
      ]}
    >
      <MaterialCommunityIcons 
        name="alert-octagon-outline" 
        size={14} 
        color="#F57C00" 
        style={styles.icon} 
      />
      <Text style={[styles.labelText, { color: "#E65100" }]}>
        Delayed Task
      </Text>
    </View>
  );
};

/**
 * Leave Balance Card: Displays available paid leaves
 */
export const LeaveBalanceCard = ({ available, total }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.badgeBase,
        {
          backgroundColor: theme.dark ? theme.colors.secondaryContainer : "#E8EAF6",
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Text style={[styles.labelText, { color: theme.colors.onSurfaceVariant }]}>
        {available === 0 && total === 0 ? (
          <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>No paid leaves</Text>
        ) : (
          <Text style={styles.labelText}>
            Paid Leaves:{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "900" }}>
              {available}/{total}
            </Text>
          </Text>
        )}
      </Text>
    </View>
  );
};

/**
 * Main Usage Example
 */
export const BadgeRow = ({ status, avialLeavesData }) => {
  return (
    <View style={styles.centeredWrapper}>
      <DelayedTaskBadge status={status} />
      <LeaveBalanceCard 
        available={avialLeavesData?.paid_leave_taken || 0} 
        total={avialLeavesData?.available_paid_leave || 0} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredWrapper: {
    flexDirection: "row", // Forces items into one line
    justifyContent: "center", // Centers the group horizontally
    alignItems: "center", // Centers the group vertically
    width: "100%",
    paddingVertical: 10,
    gap: 8, // Standard gap between the two pills
    flexWrap: "wrap", // Handles smaller screens safely
  },
  badgeBase: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6, // Unified vertical padding for both components
    borderRadius: 99, // Perfect pill shape
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});