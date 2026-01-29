import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  Card,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
  Button,
  Checkbox,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler"; // for swipeable

import {
  getLeaveDetailsReq,
  getLeaveDatesReq,
  clearLeaveDates,
  updateLeaveStatusReq,
} from "./../../store/slices/leaveManageSlice";

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const LEAVE_TYPE_OPTIONS = [
  { label: "Paid", value: "Paid" },
  { label: "Unpaid", value: "Unpaid" },
];

export default function LeaveManagementScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const border = theme.dark ? "#334155" : "#e5e7eb";

  // ✅ Year dropdown
  const [selectedYear, setSelectedYear] = useState(null);

  const yearOptions = useMemo(() => {
    const years = new Set();
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 8;
    const endYear = currentYear + 2;

    for (let y = startYear; y <= endYear; y++) years.add(String(y));

    return Array.from(years)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ label: y, value: y }));
  }, []);

  // ✅ Redux list leaves
  const leaveDetailList = useSelector((s) => s.leaveManage.leaveDetailList);
  const listLoading = useSelector((s) => s.leaveManage.loading.listLoading);

  const leavesFromStore = Array.isArray(leaveDetailList) ? leaveDetailList : [];

  const displayLeaves = useMemo(() => {
    if (!selectedYear) return [];
    return leavesFromStore.filter(
      (l) => getYear(l?.leave_date) === String(selectedYear)
    );
  }, [leavesFromStore, selectedYear]);

  useEffect(() => {
    if (!selectedYear) return;
    dispatch(getLeaveDetailsReq({ year: selectedYear }));
  }, [selectedYear, dispatch]);

  // ✅ Modal leave dates list (NEW)
  const leaveDatesList = useSelector((s) => s.leaveManage.leaveDatesList);
  const leaveDatesLoading = useSelector(
    (s) => s.leaveManage.loading.leaveDatesLoading
  );
  const updateLoading = useSelector(
    (s) => s.leaveManage.loading.updateLeaveStatusLoading
  );

  const leaveDates = Array.isArray(leaveDatesList) ? leaveDatesList : [];

  const [visible, setVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // modal status dropdown
  const [statusValue, setStatusValue] = useState("Pending");
  const [leaveTypeValue, setLeaveTypeValue] = useState("Paid");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

  const isRejected = String(statusValue || "").toLowerCase() === "rejected";
  const [isBulkUpdate, setIsBulkUpdate] = useState(false); // Track if bulk update is active

  const openLeave = (leave) => {
    setSelectedLeave(leave);
    setVisible(true);

    // default status from leave header
    setStatusValue(leave?.status || "Pending");
    setLeaveTypeValue(leave?.leave_type || "Paid");
    setRejectReason("");
    setSelectedDates([]);

    dispatch(getLeaveDatesReq({ leaveId: leave?.id }));
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedLeave(null);
    setStatusValue("Pending");
    setLeaveTypeValue("Paid");
    setRejectReason("");
    setSelectedDates([]);
    setIsBulkUpdate(false); // Close the bulk update state
    dispatch(clearLeaveDates());
  };

  // ✅ Update leave status for selected dates
  const updateSelectedDates = (status) => {
    leaveDates.forEach((item) => {
      if (selectedDates.includes(item.id)) {
        dispatch(
          updateLeaveStatusReq({
            id: item?.id, // leaveDates row id
            status,
            comment: isRejected ? rejectReason.trim() : "",
            leave_type: leaveTypeValue,
          })
        );
      }
    });
  };

  const handleBulkUpdate = (status) => {
    Alert.alert(
      "Confirm Bulk Update",
      `Are you sure you want to ${status} all selected leave dates?`,
      [
        { text: "Cancel" },
        { text: "OK", onPress: () => updateSelectedDates(status) },
      ]
    );
  };

  // Handle individual date approval or rejection
  const handleApproveReject = (item, action) => {
    if (action === "approve") {
      dispatch(
        updateLeaveStatusReq({
          id: item.id,
          status: "Approved",
          leave_type: leaveTypeValue,
        })
      );
    } else {
      // Open rejection modal for reason input
      setRejectReason("");
      setStatusValue("Rejected");
      setSelectedDates([item.id]);
    }
  };

  // Swipeable functionality for individual leave dates
  const renderLeftActions = (progress, dragX, item) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
      <TouchableOpacity
        onPress={() => handleApproveReject(item, "approve")}
        style={{
          flex: 1,
          backgroundColor: "#DCFCE7",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <MaterialCommunityIcons name="check-circle" size={30} color="#166534" />
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = (progress, dragX, item) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
      <TouchableOpacity
        onPress={() => handleApproveReject(item, "reject")}
        style={{
          flex: 1,
          backgroundColor: "#FEE2E2",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <MaterialCommunityIcons name="close-circle" size={30} color="#991B1B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Leave Management
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* ✅ Year Dropdown */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={{ color: theme.colors.onSurface, fontWeight: "700", marginBottom: 8 }}>
          Select Year
        </Text>
        <Dropdown
          style={[styles.dropdown, { backgroundColor: theme.colors.background, borderColor: border }]}
          containerStyle={[styles.dropdownMenu, { backgroundColor: theme.colors.background, borderColor: border }]}
          placeholderStyle={[styles.placeholder, { color: theme.colors.onSurface }]}
          selectedTextStyle={[styles.selectedText, { color: theme.colors.onSurface }]}
          itemTextStyle={{ color: "#5D3FD3" }}
          data={yearOptions}
          labelField="label"
          valueField="value"
          placeholder="Choose Year"
          value={selectedYear}
          onChange={(item) => setSelectedYear(item.value)}
          renderRightIcon={() => (
            <MaterialCommunityIcons name="chevron-down" size={22} color={theme.colors.onSurface} />
          )}
        />
      </View>

      {/* ✅ Leaves List */}
      {listLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <LeaveCardSkeleton key={i} />
          ))}
        </View>
      ) : !selectedYear ? (
        <EmptyState
          title="No Leaves Available"
          subtitle="Please select a year to view leave requests."
          imageSource={require("./../../../assets/empty-box.png")}
        />
      ) : displayLeaves.length === 0 ? (
        <EmptyState
          title="No Leaves Available"
          subtitle={`No leave requests found for ${selectedYear}.`}
          imageSource={require("./../../../assets/empty-box.png")}
        />
      ) : (
        <FlatList
          data={displayLeaves}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => (
            <LeaveCard leave={item} onPress={() => openLeave(item)} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        />
      )}

      {/* ✅ Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          dismissable
          contentContainerStyle={[styles.modalWrap, { backgroundColor: theme.colors.surface, borderColor: border }]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                Leave Details
              </Text>
              {!!selectedLeave && (
                <Text style={{ color: theme.colors.onSurface, opacity: 0.7 }}>
                  {selectedLeave?.employee_name} • {selectedLeave?.leave_type} •{" "}
                  {formatDate(selectedLeave?.leave_date)}
                </Text>
              )}
            </View>
            <IconButton
              onPress={closeModal}
              size={22}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="close" size={size} color={color} />
              )}
            />
          </View>

          {/* Leave Dates List */}
          <Text style={{ color: theme.colors.onSurface, fontWeight: "800", marginBottom: 8 }}>
            Leave Dates
          </Text>

          {leaveDatesLoading ? (
            <LeaveDatesModalSkeleton />
          ) : leaveDates.length ? (
            <FlatList
              data={leaveDates}
              keyExtractor={(item, index) => String(item?.id ?? index)}
              renderItem={({ item }) => (
                <Swipeable
                  renderLeftActions={(progress, dragX) =>
                    renderLeftActions(progress, dragX, item)
                  }
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, item)
                  }
                >
                  <LeaveDateRow item={item} />
                </Swipeable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              scrollEnabled={false}
            />
          ) : (
            <Text style={{ color: theme.colors.onSurface, opacity: 0.75 }}>
              No leave dates found for this request.
            </Text>
          )}

          {/* Bulk Update Section */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: theme.colors.onSurface, fontWeight: "700", marginBottom: 8 }}>
              Bulk Update
            </Text>

            <Checkbox.Item
              label="Select All"
              status={selectedDates.length === leaveDates.length ? "checked" : "unchecked"}
              onPress={() =>
                setSelectedDates(
                  selectedDates.length === leaveDates.length
                    ? []
                    : leaveDates.map((item) => item.id)
                )
              }
            />
          </View>

          {/* Save Button */}
          <View style={{ marginTop: 12 }}>
            <Button
              mode="contained"
              loading={updateLoading}
              disabled={(!statusValue || (isRejected && !rejectReason.trim()))}
              onPress={() => handleBulkUpdate(statusValue)}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

// **Skeletons** and other helper functions will be used here

/** ------- UI Components ------- */

function LeaveCard({ leave, onPress }) {
  const theme = useTheme();
  const border = theme.dark ? "#334155" : "#e5e7eb";
  const statusStyles = getStatusStyles(leave?.status);

  return (
    <Card
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: border,
          borderWidth: 1,
        },
      ]}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.onSurface, opacity: 0.7 },
              ]}
            >
              Employee
            </Text>
            <Text
              style={[styles.valueSmall, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {leave?.employee_name || "-"}
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

        <InfoRow label="Leave Date" value={formatDate(leave?.leave_date)} />
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

        {/* ✅ View Detail button */}
        <View style={{ height: 12 }} />

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
          }}
        >
          <MaterialCommunityIcons
            name="eye-outline"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>
            View Detail
          </Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}

function LeaveDateRow({ item }) {
  const theme = useTheme();
  const border = theme.dark ? "#334155" : "#e5e7eb";
  const statusStyles = getStatusStyles(item?.status);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: border,
        borderRadius: 12,
        padding: 12,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={styles.rowBetween}>
        <View>
          <Text style={{ color: theme.colors.onSurface, fontWeight: "800" }}>
            {formatDate(item?.leave_date)}
          </Text>
          <Text style={{ color: theme.colors.onSurface, opacity: 0.7 }}>
            {item?.leave_type} • Count: {item?.leave_count ?? "-"}
          </Text>
        </View>

        <View style={[styles.statusPill, statusStyles.pill]}>
          <Text style={[styles.statusText, statusStyles.text]}>
            {item?.status || "-"}
          </Text>
        </View>
      </View>
    </View>
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

function EmptyState({ title, subtitle, imageSource }) {
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

/** Skeletons */
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
            <View style={[styles.skelLine, { width: "45%" }]} />
            <View
              style={[
                styles.skelLine,
                { width: "70%", marginTop: 8, height: 14 },
              ]}
            />
          </View>
          <View style={styles.skelPill} />
        </View>

        <View style={styles.divider} />

        <View style={[styles.skelLine, { width: "60%" }]} />
        <View style={[styles.skelLine, { width: "50%", marginTop: 10 }]} />
        <View style={[styles.skelLine, { width: "45%", marginTop: 10 }]} />
        <View style={[styles.skelLine, { width: "40%", marginTop: 10 }]} />
      </Card.Content>
    </Card>
  );
}

function LeaveDatesModalSkeleton() {
  const theme = useTheme();
  const bg = theme.dark ? "#1f2937" : "#e5e7eb";

  const Row = () => (
    <View
      style={{
        borderRadius: 12,
        padding: 12,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.dark ? "#334155" : "#e5e7eb",
      }}
    >
      <View
        style={{
          height: 12,
          width: "55%",
          borderRadius: 6,
          backgroundColor: bg,
        }}
      />
      <View
        style={{
          height: 12,
          width: "75%",
          borderRadius: 6,
          backgroundColor: bg,
          marginTop: 10,
        }}
      />
    </View>
  );

  return (
    <View style={{ gap: 10 }}>
      <Row />
      <Row />
      <Row />
    </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },

  card: { elevation: 2, borderRadius: 14 },

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
  valueSmall: { fontSize: 13, fontWeight: "700" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  emptyImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
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

  modalWrap: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  modalTitle: { fontSize: 16, fontWeight: "800" },

  skelLine: { height: 12, borderRadius: 8, backgroundColor: "#E5E7EB" },
  skelPill: {
    width: 84,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
});
