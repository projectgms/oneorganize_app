import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from 'react-native-paper';

/**
 * task shape (example):
 * {
 *  PROJECT: "Attendance Keeper Mobile",
 *  TASK_SEQ: "15",
 *  TASK_TITLE: "Integrate Worklog API with Screen",
 *  DESCRIPTION: "Brainstorming brings team members' diverse experience into play.",
 *  PRIORITY: "High",
 *  STATUS: "In Progress",
 *  PROGRESS: 65, // number 0-100 or "65%"
 *  EST_HOURS: 12,
 *  START_DATE: "2023-08-10",
 *  END_DATE: "2023-08-15",
 *  ASSIGNED_TO: "Ahmad"
 * }
 */

export default function TaskCard({ task, onPress, showMeta = true }) {
  const theme = useTheme();

  // ✅ support both UPPERCASE and API snake_case
  const title = task?.TASK_TITLE ?? task?.title ?? "Untitled task";
  const description = task?.DESCRIPTION ?? task?.description ?? "";
  const project =
    task?.PROJECT ??
    task?.project?.project_name ??
    (task?.project_id ? `Project: ${task.project_name}` : "Project");

  const priority = task?.PRIORITY ?? task?.priority ?? "";
  const status = task?.STATUS ?? task?.status ?? "";
  const progressVal = task?.PROGRESS ?? task?.progress ?? 0;
  const estHours = task?.EST_HOURS ?? task?.estimated_hours ?? null;
  const endDateRaw = task?.END_DATE ?? task?.end_date ?? "";
  const seq = task?.TASK_SEQ ?? task?.task_seq ?? null;

  const assignee =
    task?.ASSIGNED_TO ??
    task?.assigned_users?.[0]?.name ??
    task?.assigned_users?.[0]?.full_name ??
    "";

  const progressText =
    typeof progressVal === "number" ? `${progressVal}%` : String(progressVal ?? "0%");

  const endDateLabel = formatDate(endDateRaw) || endDateRaw || "";

  const priorityStyles = getPriorityPill(priority);
  const statusStyles = getStatusPill(status);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.onSurface,
          borderWidth: 0.5,            // ✅ you were setting borderColor but borderWidth was commented
          opacity: pressed ? 0.85 : 1 // ✅ use pressed feedback
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {title}
        </Text>

        {seq ? (
          <View style={styles.seqPill}>
            <Text style={styles.seqText}>#{seq}</Text>
          </View>
        ) : null}
      </View>

      {!!description && (
        <Text style={[styles.desc, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {description}
        </Text>
      )}

      <View style={styles.projectRow}>
        <View style={styles.projectLeft}>
          <MaterialCommunityIcons name="file-document-outline" size={16} color="#6B7280" />
          <Text style={[styles.projectName, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {project}
          </Text>
        </View>

        {!!endDateLabel && (
          <Text style={styles.dateText} numberOfLines={1}>
            {endDateLabel}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={[styles.pill, priorityStyles.pill]}>
          <Text style={[styles.pillText, priorityStyles.text]}>
            {priority ? `${priority} Priority` : "Priority"}
          </Text>
        </View>

        {showMeta && (
          <View style={styles.metaRow}>
            {!!status && (
              <View style={[styles.smallPill, statusStyles.pill]}>
                <Text style={[styles.smallPillText, statusStyles.text]} numberOfLines={1}>
                  {status}
                </Text>
              </View>
            )}

            <View style={styles.iconStat}>
              <MaterialCommunityIcons name="progress-check" size={16} color="#6B7280" />
              <Text style={styles.iconStatText}>{progressText}</Text>
            </View>

            {estHours !== null && estHours !== undefined && (
              <View style={styles.iconStat}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
                <Text style={styles.iconStatText}>{String(estHours)}h</Text>
              </View>
            )}

            {!!assignee && (
              <View style={styles.iconStat}>
                <MaterialCommunityIcons name="account-outline" size={16} color="#6B7280" />
                <Text style={styles.iconStatText} numberOfLines={1}>
                  {assignee}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}


/** Helpers */
function getPriorityPill(priorityRaw) {
  const p = String(priorityRaw || "").toLowerCase();

  // soft pill styles (like screenshot)
  if (p.includes("high"))
    return { pill: { backgroundColor: "#FEE2E2" }, text: { color: "#991B1B" } };
  if (p.includes("medium") || p.includes("mid"))
    return { pill: { backgroundColor: "#FEF3C7" }, text: { color: "#92400E" } };
  if (p.includes("low"))
    return { pill: { backgroundColor: "#DCFCE7" }, text: { color: "#166534" } };

  return { pill: { backgroundColor: "#E5E7EB" }, text: { color: "#374151" } };
}

function getStatusPill(statusRaw) {
  const s = String(statusRaw || "").toLowerCase();

  if (s.includes("done") || s.includes("complete"))
    return { pill: { backgroundColor: "#DCFCE7" }, text: { color: "#166534" } };
  if (s.includes("progress") || s.includes("doing"))
    return { pill: { backgroundColor: "#DBEAFE" }, text: { color: "#1D4ED8" } };
  if (s.includes("hold") || s.includes("blocked"))
    return { pill: { backgroundColor: "#FEE2E2" }, text: { color: "#991B1B" } };

  return { pill: { backgroundColor: "#E5E7EB" }, text: { color: "#374151" } };
}

function formatDate(input) {
  if (!input) return "";
  // Accepts "YYYY-MM-DD", ISO string, or Date-like
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);

  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    // borderWidth: 1,
    // borderColor: "#EEF2F7",
    // shadowColor: "#000",
    // shadowOpacity: 0.06,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 20,
  },
  seqPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  seqText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  desc: {
    marginTop: 6,
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
  },

  projectRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  projectLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  projectName: {
    fontSize: 12.5,
    color: "#4B5563",
    fontWeight: "600",
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // flexShrink: 1,
    // flexWrap: "wrap",
    // justifyContent: "flex-end",
  },

  smallPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  smallPillText: {
    fontSize: 12,
    fontWeight: "700",
  },

  iconStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: 130,
  },
  iconStatText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
});
