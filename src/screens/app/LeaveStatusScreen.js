import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Modal,
  PaperProvider,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaveDetailsReq,
  getAvailLeavesDataReq,
} from "./../../store/slices/leaveManageSlice";
import { useFocusEffect } from "@react-navigation/native";

const LeaveStatusScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    const currentYear = new Date().getFullYear();
    setVisible(true);
    dispatch(getAvailLeavesDataReq({year: currentYear}))
  };
  const hideModal = () => setVisible(false);

  // ✅ FIX: you forgot to import useSelector in your code
  const { leaveDetailList } = useSelector((s) => s.leaveManage);

  const loading = useSelector((s) => s.leaveManage.loading?.listLoading);
  const availLeavesLoading = useSelector(
    (s) => s.leaveManage.loading?.avialLeavesLoading,
  );

  const availLeavesData = useSelector((s) => s.leaveManage.avialLeavesData);

  // useFocusEffect(

  //   React.useCallback(() => {

  //         const currentYear = new Date().getFullYear();

  //     dispatch(getLeaveDetailsReq({year: currentYear}));
  //   }, [dispatch]),
  // );

  // ✅ dropdown styling same as ApplyLeaveScreen
  const border = theme.dark ? "#334155" : "#e5e7eb";

  // ✅ Year dropdown state
  const [selectedYear, setSelectedYear] = useState(null);

  // ✅ Year options (last 8 years + next 2 years)
  const yearOptions = useMemo(() => {
    const years = new Set();

    // include current year range
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 8;
    const endYear = currentYear + 2;

    for (let y = startYear; y <= endYear; y++) {
      years.add(String(y));
    }

    return Array.from(years)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, []);

  // ✅ DISPATCH API when year selected
  useEffect(() => {
    if (!selectedYear) return;
    dispatch(getLeaveDetailsReq({ year: selectedYear })); // ✅ payload with selected year
  }, [selectedYear]);

  // ✅ Redux data
  const leavesFromStore = Array.isArray(leaveDetailList) ? leaveDetailList : [];

  // ✅ If API already returns year-filtered list, you can skip this filter.
  const displayLeaves = useMemo(() => {
    if (!selectedYear) return [];
    return leavesFromStore.filter(
      (l) => getYear(l?.leave_date) === String(selectedYear),
    );
  }, [leavesFromStore, selectedYear]);

  // const leaveSummaryData = [
  //   {
  //     employee_id: 24,
  //     employee_name: "Pradum Shinde",
  //     leave_type: "Paid",
  //     no_of_leaves: "15+0=15",
  //     applicable_leaves: "0+0= 0",
  //     monthly_limit: 3,
  //     paid_leave_taken: 0,
  //     available_paid_leave: 0,
  //   },
  // ];

  const leaveSummaryData = availLeavesData || [];

  const LABELS = {
    leave_type: "Leave Type",
    no_of_leaves: "No. of Leaves",
    applicable_leaves: "Applicable Leaves",
    monthly_limit: "Monthly Limit",
    paid_leave_taken: "Paid Leave Taken",
    available_paid_leave: "Available Paid Leave",
  };

  const HIDDEN_KEYS = new Set(["employee_id", "employee_name"]);

  const formatKey = (k) =>
    LABELS[k] ?? k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Leave Status
        </Text>

        <Button mode={"contained"} onPress={showModal}>
          Show Leave Details
        </Button>
        <View style={{ width: 44 }} />
      </View>

      {/* Dropdown */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text
          style={{
            color: theme.colors.onSurface,
            fontWeight: "700",
            marginBottom: 8,
          }}
        >
          Select Year
        </Text>

        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.colors.background,
              borderColor: border,
            },
          ]}
          containerStyle={[
            styles.dropdownMenu,
            {
              backgroundColor: theme.colors.background,
              borderColor: border,
            },
          ]}
          placeholderStyle={[
            styles.placeholder,
            { color: theme.colors.onSurface },
          ]}
          selectedTextStyle={[
            styles.selectedText,
            { color: theme.colors.onSurface },
          ]}
          itemTextStyle={{ color: "#5D3FD3" }}
          data={yearOptions}
          labelField="label"
          valueField="value"
          placeholder="Choose Year"
          value={selectedYear}
          onChange={(item) => setSelectedYear(item.value)}
          renderRightIcon={() => (
            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color={theme.colors.onSurface}
            />
          )}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <LeaveCardSkeleton key={i} />
          ))}
        </View>
      ) : !selectedYear ? (
        <EmptyLeavesCard
          title="No Leaves Available"
          subtitle="Please select a year to view leave requests."
          imageSource={require("./../../../assets/empty-box.png")}
        />
      ) : displayLeaves.length === 0 ? (
        <EmptyLeavesCard
          title="No Leaves Available"
          subtitle={`No leave requests found for ${selectedYear}.`}
          imageSource={require("./../../../assets/empty-box.png")}
        />
      ) : (
        <FlatList
          data={displayLeaves}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => <LeaveCard leave={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        />
      )}

      {/*  Leave Details Modal Below */}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          dismissable
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            padding: 16,
            marginHorizontal: 16,
            borderRadius: 12,
          }}
        >
          {/* Header with title + close icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Leave Details
            </Text>

            <IconButton
              onPress={hideModal}
              size={22}
              icon={({ size, color }) => (
                <MaterialCommunityIcons
                  name="close"
                  size={size}
                  color={color}
                />
              )}
            />
          </View>

          {availLeavesLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              {/* your content here... */}
              {Array.isArray(leaveSummaryData) && leaveSummaryData.length ? (
                leaveSummaryData.map((row, idx) => {
                  const entries = Object.entries(row).filter(
                    ([key]) => !HIDDEN_KEYS.has(key),
                  );

                  return (
                    <View key={idx} style={{ marginBottom: 12 }}>
                      {entries.map(([key, value]) => (
                        <View
                          key={key}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.dark
                              ? "#334155"
                              : "#e5e7eb",
                          }}
                        >
                          <Text
                            style={{
                              color: theme.colors.onSurface,
                              fontWeight: "600",
                              flex: 1,
                              paddingRight: 12,
                            }}
                          >
                            {formatKey(key)}
                          </Text>
                          <Text style={{ color: theme.colors.onSurface }}>
                            {String(value)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: theme.colors.onSurface }}>
                  No leave details available.
                </Text>
              )}
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

export default LeaveStatusScreen;

/** ✅ Empty state card (no border + centered image) */
function EmptyLeavesCard({ title, subtitle, imageSource }) {
  const theme = useTheme();

  return (
    <View style={{ padding: 16, paddingTop: 8 }}>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="contained"
      >
        <Card.Content style={{ alignItems: "center", paddingVertical: 18 }}>
          {!!imageSource && (
            <Image
              source={imageSource}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          )}
          <Text
            style={{
              color: theme.colors.onSurface,
              fontWeight: "800",
              fontSize: 16,
            }}
          >
            {title}
          </Text>
          {!!subtitle && (
            <Text
              style={{
                marginTop: 6,
                color: theme.colors.onSurface,
                opacity: 0.75,
                textAlign: "center",
              }}
            >
              {subtitle}
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

/** ✅ Leave Card (excludes id / employee_id / employee_name) */
function LeaveCard({ leave }) {
  const theme = useTheme();

  console.log("LEAVE ", leave)
  const statusStyles = getStatusStyles(leave?.status);

  const border = theme.dark ? "#334155" : "#e5e7eb";

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: border,
          borderWidth: 1,
          elevation: 2,
        },
      ]}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.rowBetween}>
          <View>
            <Text
              style={[
                styles.label,
                { color: theme.colors.onSurface, opacity: 0.7 },
              ]}
            >
              Leave Date
            </Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>
              {formatDate(leave?.leave_date)}
            </Text>
          </View>

          <View style={[styles.statusPill, statusStyles.pill]}>
            <Text
              style={[styles.statusText, statusStyles.text]}
              numberOfLines={1}
            >
              {leave?.status || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <InfoRow label="Type" value={leave?.leave_type} />
        <InfoRow label="Applied On" value={formatDate(leave?.applied_on)} />
        <InfoRow label="Duration" value={formatDuration(leave?.duration)} />

        {!!leave?.leave_reason && (
          <View style={{ marginTop: 10 }}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.onSurface, opacity: 0.7 },
              ]}
            >
              Reason
            </Text>
            <Text
              style={[styles.reason, { color: theme.colors.onSurface }]}
              numberOfLines={3}
            >
              {leave.leave_reason}
            </Text>
          </View>
        )}

        {!!leave?.comment  && (
          <View style={{ marginTop: 10 }}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.onSurface, opacity: 0.7 },
              ]}
            >
              Comment on your leave
            </Text>
            <Text
              style={[styles.reason, { color: theme.colors.onSurface }]}
              numberOfLines={3}
            >
              {leave.comment}
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
      <Text
        style={[styles.label, { color: theme.colors.onSurface, opacity: 0.7 }]}
      >
        {label}
      </Text>
      <Text
        style={[styles.valueSmall, { color: theme.colors.onSurface }]}
        numberOfLines={1}
      >
        {value || "-"}
      </Text>
    </View>
  );
}

/** ✅ Skeleton */
function LeaveCardSkeleton() {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <View style={[styles.skelLine, { width: "35%" }]} />
            <View
              style={[
                styles.skelLine,
                { width: "60%", marginTop: 8, height: 14 },
              ]}
            />
          </View>
          <View style={styles.skelPill} />
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
function getYear(input) {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input).slice(0, 4);
  return String(d.getFullYear());
}

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
  if (s === "first_half") return "First Half";
  if (s === "second_half") return "Second Half";
  if (s === "2_hours") return "2 Hours Leave";
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

  // ✅ No border + no shadow for cards
  card: {
    borderWidth: 0,
    elevation: 2,
    borderRadius: 14,
  },
  modalContainer: { backgroundColor: "white", padding: 20 },

  emptyImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },

  // ✅ Dropdown styles same as ApplyLeaveScreen
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  dropdownMenu: {
    borderRadius: 10,
    borderWidth: 1,
  },
  placeholder: { fontSize: 14, opacity: 0.6 },
  selectedText: { fontSize: 14, fontWeight: "700" },

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

  // Skeleton
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
