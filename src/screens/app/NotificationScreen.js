import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Card, Text, useTheme, Chip, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { fetchHrmOverviewRequest } from "./../../store/slices/hrmSlice";
import { useDispatch, useSelector } from "react-redux";
import {NotificationSkeletonCard} from "./components/NotificationScreen/NotificationSkeletonCard";

/**
 * Replace this with your real data from Redux/API.
 * Example: const announcements = useSelector(s => s.app.announcements)
 */
const MOCK_DATA = [
  {
    id: 4,
    tenant_id: 3,
    title: "employee evalution form open",
    start_date: "2026-01-12",
    end_date: "2026-02-12",
    branch_id: "all",
    department_id: "all",
    employee_id: "all",
    description: "please fill the evalutaion",
    created_by: 7,
    created_at: "2026-01-12T05:18:51.000000Z",
    updated_at: "2026-01-12T05:18:51.000000Z",
  },
];

export default function NotificationScreen() {
  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHrmOverviewRequest());
  }, []);

  const { loading, annoucements } = useSelector((s) => s.hrm);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const navigation = useNavigation();

  // swap MOCK_DATA with your store data:
  const data = annoucements;

  const bg = theme.colors.background;
  const cardBg = theme.dark
    ? theme.colors.elevation?.level1 || theme.colors.surface
    : theme.colors.surface;

  const border =
    theme.colors.outlineVariant || theme.colors.outline || "#e5e7eb";
  const muted = theme.colors.onSurfaceVariant || theme.colors.onSurface;

  function isLong(text, minLen) {
    return (text || "").length > minLen;
  }

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleExpand(item.id)}
      >
        <Card
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <View style={styles.cardInner}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.dark ? "#243244" : "#EEF2FF" },
              ]}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              {/* Title row */}
              <View style={styles.titleRow}>
                <Text
                  style={[styles.title, { color: theme.colors.onSurface }]}
                  numberOfLines={isExpanded ? 0 : 1}
                >
                  {capitalize(item.title)}
                </Text>

                <Text style={[styles.date, { color: muted }]}>
                  {item.start_date}
                </Text>
              </View>

              {/* Description */}
              {!!item.description && (
                <Text
                  style={[styles.desc, { color: muted }]}
                  numberOfLines={isExpanded ? 0 : 2}
                >
                  {capitalize(item.description)}
                </Text>
              )}

              {/* Expand / Collapse hint */}
              {(isLong(item.title, 28) || isLong(item.description, 80)) && (
                <View style={styles.expandRow}>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "700",
                      fontSize: 12,
                    }}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </Text>
                  <MaterialCommunityIcons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
              )}

              {/* Chips */}
              <View style={styles.chipsRow}>
                <Chip
                  compact
                  style={[
                    styles.chip,
                    { backgroundColor: theme.dark ? "#1F2A37" : "#F3F4F6" },
                  ]}
                  textStyle={{ color: muted, fontSize: 12 }}
                >
                  {formatDateRange(item.start_date, item.end_date)}
                </Chip>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
          iconColor={theme.colors.onSurface}
          style={{ margin: 0 }}
        />

        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Notifications
        </Text>

        <Text style={{ color: muted }}>{data.length} new</Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={44}
            color={muted}
          />
          <Text
            style={{
              marginTop: 10,
              color: theme.colors.onSurface,
              fontWeight: "700",
            }}
          >
            No notifications
          </Text>
          <Text style={{ marginTop: 6, color: muted, textAlign: "center" }}>
            You’re all caught up. New updates will appear here.
          </Text>
        </View>
      ) : (
        <View style={{paddingHorizontal:12}}>
          {loading ? (
            <NotificationSkeletonCard />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              // wire this up to your API refresh
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => {}} />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}

function formatDateRange(start, end) {
  if (!start && !end) return "—";
  if (start && !end) return `From ${start}`;
  if (!start && end) return `Until ${end}`;
  return `${start} → ${end}`;
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  expandRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", flex: 1 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 0,
  },
  cardInner: {
    padding: 14,
    flexDirection: "row",
    gap: 12, // if your RN version doesn't support gap, replace with marginLeft
    alignItems: "flex-start",
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: { fontSize: 15, fontWeight: "800", flex: 1 },
  date: { fontSize: 12, fontWeight: "700" },

  desc: { marginTop: 6, fontSize: 13, lineHeight: 18 },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  chip: { borderRadius: 999 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
