import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

/**
 * @param {string} available - e.g., "4"
 * @param {string} total - e.g., "15"
 */
export const LeaveBalanceCard = ({ available, total }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: theme.dark
            ? theme.colors.secondaryContainer
            : "#E8EAF6",
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <Text
        style={[styles.labelText, { color: theme.colors.onSurfaceVariant }]}
      >
        
        {available === 0 && total === 0 ? (
          <Text style={[styles.countText, { color: theme.colors.primary }]}>
            You do not have paid leaves
          </Text>
        ) : (
          <Text
            style={[styles.labelText, { color: theme.colors.onSurfaceVariant }]}
          >
            Total Available Paid Leaves:{" "}
            <Text style={[styles.countText, { color: theme.colors.primary }]}>
              {available} / {total}
            </Text>
          </Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignSelf: "flex-end", // Only takes as much width as needed
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99, // Pill shape
    borderWidth: 1,
    marginVertical: 0,
    marginHorizontal: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
