import React, { useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import {getLeaveDetailsReq} from './../../store/slices/leaveManageSlice';
import { useDispatch } from 'react-redux';

const LeaveStatusScreen = () => {
  const theme = useTheme();

  const dispatch = useDispatch();



  // ✅ replace with redux / api data later
  const loading = false;

  const leaves = useMemo(
    () => [
      {
        id: 76,
        employee_id: 24,
        leave_date: "2026-01-23",
        leave_type: "Unpaid",
        status: "Pending",
        applied_on: "2026-01-23",
        leave_reason: "D d c c c c c c c c",
        duration: "full_day",
        employee_name: "Pradum Shinde",
      },
      {
        id: 72,
        employee_id: 24,
        leave_date: "2026-01-13",
        leave_type: "Unpaid",
        status: "Pending",
        applied_on: "2026-01-23",
        leave_reason: "Nothing",
        duration: "full_day",
        employee_name: "Pradum Shinde",
      },
    ],
    []
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {Array.from({ length: 2 }).map((_, i) => (
          <LeaveCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={leaves}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LeaveCard leave={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} mode="contained">
            <Card.Content style={{ alignItems: "center", paddingVertical: 18 }}>
              <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>
                No Leave Requests
              </Text>
              <Text style={{ marginTop: 6, color: theme.colors.onSurface, opacity: 0.75 }}>
                You don’t have any leave requests yet.
              </Text>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
};

export default LeaveStatusScreen;

function LeaveCard({ leave }) {
  const theme = useTheme();

  const statusStyles = getStatusStyles(leave?.status);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="contained">
      <Card.Content>
        {/* Top Row: Leave Date + Status pill */}
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.label, { color: theme.colors.onSurface, opacity: 0.7 }]}>
              Leave Date
            </Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>
              {formatDate(leave?.leave_date)}
            </Text>
          </View>

          <View style={[styles.statusPill, statusStyles.pill]}>
            <Text style={[styles.statusText, statusStyles.text]} numberOfLines={1}>
              {leave?.status || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Info rows */}
        <InfoRow label="Type" value={leave?.leave_type} />
        <InfoRow label="Applied On" value={formatDate(leave?.applied_on)} />
        <InfoRow label="Duration" value={formatDuration(leave?.duration)} />

        {!!leave?.leave_reason && (
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.label, { color: theme.colors.onSurface, opacity: 0.7 }]}>
              Reason
            </Text>
            <Text style={[styles.reason, { color: theme.colors.onSurface }]} numberOfLines={3}>
              {leave.leave_reason}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

function InfoRow({ label, value }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: theme.colors.onSurface, opacity: 0.7 }]}>{label}</Text>
      <Text style={[styles.valueSmall, { color: theme.colors.onSurface }]} numberOfLines={1}>
        {value || "-"}
      </Text>
    </View>
  );
}

/** ✅ Skeleton */
function LeaveCardSkeleton() {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="contained">
      <Card.Content>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <View style={[styles.skelLine, { width: "35%" }]} />
            <View style={[styles.skelLine, { width: "60%", marginTop: 8, height: 14 }]} />
          </View>
          <View style={[styles.skelPill]} />
        </View>

        <View style={styles.divider} />

        <View style={[styles.skelLine, { width: "55%" }]} />
        <View style={[styles.skelLine, { width: "45%", marginTop: 10 }]} />
        <View style={[styles.skelLine, { width: "35%", marginTop: 10 }]} />

        <View style={{ marginTop: 14 }}>
          <View style={[styles.skelLine, { width: "25%" }]} />
          <View style={[styles.skelLine, { width: "90%", marginTop: 8 }]} />
          <View style={[styles.skelLine, { width: "78%", marginTop: 8 }]} />
        </View>
      </Card.Content>
    </Card>
  );
}

/** Helpers */
function formatDate(input) {
  if (!input) return "-";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDuration(v) {
  const s = String(v || "").toLowerCase();
  if (s === "full_day") return "Full Day";
  if (s === "half_day") return "Half Day";
  return v || "-";
}

function getStatusStyles(statusRaw) {
  const s = String(statusRaw || "").toLowerCase();

  if (s.includes("approve"))
    return { pill: { backgroundColor: "#DCFCE7" }, text: { color: "#166534" } };
  if (s.includes("reject"))
    return { pill: { backgroundColor: "#FEE2E2" }, text: { color: "#991B1B" } };
  if (s.includes("pending"))
    return { pill: { backgroundColor: "#FEF3C7" }, text: { color: "#92400E" } };

  return { pill: { backgroundColor: "#E5E7EB" }, text: { color: "#374151" } };
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  card: {
    borderWidth: 0, // ✅ no border
    elevation: 0,   // ✅ no shadow
    borderRadius: 14,
  },

  emptyCard: {
    borderWidth: 0,
    elevation: 0,
    borderRadius: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: "#EEF2F7",
  },

  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "800" },
  valueSmall: { fontSize: 13, fontWeight: "700" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },

  reason: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "800" },

  // Skeleton shapes
  skelLine: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  skelPill: {
    width: 84,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
});
