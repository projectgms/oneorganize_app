import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, useTheme, Avatar, Badge, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Helper for the Calendar Icon
const CalendarIcon = ({ dateString }) => {
  const theme = useTheme();
  const date = new Date(dateString || Date.now());
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate().toString().padStart(2, "0");

  return (
    <View
      style={[
        styles.calendarContainer,
        { borderColor: theme.colors.outlineVariant },
      ]}
    >
      <View
        style={[
          styles.calendarHeader,
          {
            backgroundColor: theme.dark
              ? theme.colors.secondaryContainer
              : theme.colors.secondary,
          },
        ]}
      >
        <Text
          style={[
            styles.calendarMonth,
            {
              color: theme.dark
                ? theme.colors.onSecondaryContainer
                : theme.colors.onSecondary,
            },
          ]}
        >
          {month}
        </Text>
      </View>
      <View
        style={[
          styles.calendarBody,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text
          style={[styles.calendarDay, { color: theme.colors.onSurfaceVariant }]}
        >
          {day}
        </Text>
      </View>
    </View>
  );
};

export default function LeaveCard({ leave, onPress }) {
  const theme = useTheme();

  // Dynamic semantic colors for status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return theme.dark ? "#81C784" : "#4CAF50";
      case "rejected":
        return theme.dark ? "#E57373" : "#F44336";
      default:
        return theme.dark ? "#FFB74D" : "#FF9800";
    }
  };

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      onPress={onPress}
      mode="outlined"
    >
      <Card.Content>
        {/* Top Section: Avatar & Status */}
        <View style={styles.headerRow}>
          <View style={styles.employeeInfo}>
            {leave?.profile_picture ? (
              <Avatar.Image size={35} source={{ uri: leave.profile_picture }} />
            ) : (
              <Avatar.Text
                size={35}
                label={
                  leave?.employee_name?.substring(0, 2).toUpperCase() || "E"
                }
                style={{ backgroundColor: theme.colors.primaryContainer }}
                labelStyle={{ color: theme.colors.onPrimaryContainer }}
              />
            )}
            <View style={{ marginLeft: 12 }}>
              <Text
                style={[styles.employeeName, { color: theme.colors.onSurface }]}
              >
                {leave?.employee_name}
              </Text>
              <Text
                style={[
                  styles.leaveType,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {leave?.leave_type} Leave
              </Text>
            </View>
          </View>
          <Badge
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(leave?.status),
                color: theme.dark ? "#000" : "#fff",
              },
            ]}
          >
            {leave?.status?.toUpperCase()}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        {/* Middle Section: Date & Info Grid */}
        <View style={styles.mainContent}>
          <CalendarIcon dateString={leave?.leave_date} />

          <View style={styles.infoGrid}>
            <View style={styles.gridItem}>
              <Text style={[styles.label, { color: theme.colors.secondary }]}>
                Duration
              </Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                {leave?.duration || "1 Day"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.label, { color: theme.colors.secondary }]}>
                Applied On
              </Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                {new Date(leave?.applied_on).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Reason Preview */}
        {!!leave?.leave_reason && (
          <View
            style={[
              styles.reasonBox,
              { backgroundColor: theme.colors.surfaceDisabled, opacity: 0.8 },
            ]}
          >
            <MaterialCommunityIcons
              name="format-quote-open"
              size={16}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.reasonText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {leave.leave_reason}
            </Text>
          </View>
        )}

        {/* Bottom Action */}
        <TouchableOpacity style={styles.footerAction} onPress={onPress}>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            Approve Request
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  leaveType: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    fontWeight: "900",
    paddingHorizontal: 10,
    borderRadius: 6,
    height: 22,
    fontSize: 10,
  },
  divider: {
    marginVertical: 14,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoGrid: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    justifyContent: "space-between",
  },
  gridItem: {
    alignItems: "flex-start",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
  },
  reasonBox: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    fontStyle: "italic",
    marginLeft: 8,
    lineHeight: 18,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  calendarContainer: {
    width: 54,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  calendarHeader: {
    paddingVertical: 3,
    alignItems: "center",
  },
  calendarMonth: {
    fontSize: 10,
    fontWeight: "900",
  },
  calendarBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDay: {
    fontSize: 22,
    fontWeight: "800",
  },
});
