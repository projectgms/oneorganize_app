import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  useTheme,
  Modal,
  TextInput,
  Checkbox,
  Portal,
  Divider,
  Badge,
  Avatar,
} from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaveDatesReq,
  clearLeaveDates,
  updateLeaveStatusReq,
  updateBulkLeaveReq,
} from "../../store/slices/leaveManageSlice";

export default function SingleLeaveDataScreen({ navigation }) {
  const route = useRoute();
  const { leaveId } = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();

  // Retrieve leave details to show the User info
  const selectedLeave = useSelector((s) =>
    s.leaveManage.leaveDetailList.find((l) => l.id === leaveId),
  );

  const leaveDatesList = useSelector((s) => s.leaveManage.leaveDatesList);
  // console.log("leaveDatesList",leaveDatesList)
  const leaveDatesListLoading = useSelector(
    (s) => s.leaveManage.loading.leaveDatesLoading,
  );
  const leaveDates = Array.isArray(leaveDatesList) ? leaveDatesList : [];

  const [selectedDates, setSelectedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [statusValue, setStatusValue] = useState("Pending");
  const [leaveTypeValue, setLeaveTypeValue] = useState("Paid");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (leaveId) dispatch(getLeaveDatesReq(leaveId));
    return () => dispatch(clearLeaveDates());
  }, [leaveId]);

  const formatDateParts = (dateString) => {
    const date = new Date(dateString);
    const mon = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const day = date.getDate().toString().padStart(2, "0");
    return { mon, day };
  };

  const toggleSelection = (id) => {
    setSelectedDates((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openUpdateModal = (item = null) => {
    if (item) {
      setIsBulkUpdate(false);
      setEditingId(item.id);
      setStatusValue(item.status);
      setLeaveTypeValue(item.leave_type);
      setRejectReason(item.comment || "");
    } else {
      setIsBulkUpdate(true);
      setStatusValue("Approved");
      setLeaveTypeValue("Paid");
      setRejectReason("");
    }
    setModalVisible(true);
  };

  const handleApply = () => {
    const singlePayload = {
      // leave_ids: isBulkUpdate ? selectedDates : [editingId],
      id: editingId,
      leave_id: leaveId,
      status: statusValue,
      leave_type: leaveTypeValue,
      comment: statusValue === "Rejected" ? rejectReason : "",
    };

    const multiplePayload = {
      id: selectedDates,
      leave_id: leaveId,
      status: statusValue,
      leave_type: leaveTypeValue,
      comment: statusValue === "Rejected" ? rejectReason : "",
    }
    
    if(!isBulkUpdate){
      dispatch(updateLeaveStatusReq(singlePayload));
    }else{
      dispatch(updateBulkLeaveReq(multiplePayload));
    }

    setModalVisible(false);
    setSelectedDates([]);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return { color: theme.dark ? "#81C784" : "#4CAF50" };
      case "Rejected":
        return { color: theme.dark ? "#E57373" : "#F44336" };
      default:
        return { color: theme.dark ? "#FFB74D" : "#FF9800" };
    }
  };

  const renderSkeleton = () => (
    <View style={{ padding: 16 }}>
      {[1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceVariant, opacity: 0.5 },
          ]}
        >
          <View style={[styles.cardRow, { height: 80 }]} />
        </Card>
      ))}
    </View>
  );

  const renderItem = ({ item }) => {
    const { mon, day } = formatDateParts(item.leave_date);
    const isSelected = selectedDates.includes(item.id);
    const statusStyle = getStatusStyles(item.status);

    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
        ]}
        mode="elevated"
      >
        <View style={styles.cardRow}>
          <Checkbox
            status={isSelected ? "checked" : "unchecked"}
            onPress={() => toggleSelection(item.id)}
            color={theme.colors.primary}
          />

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
                    : "#78909c",
                },
              ]}
            >
              <Text style={styles.calendarMonth}>{mon}</Text>
            </View>
            <View
              style={[
                styles.calendarBody,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text
                style={[
                  styles.calendarDay,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {day}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text
              style={[styles.commentTitle, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {item.comment || "Leave Request"}
            </Text>
            <View style={styles.statusRow}>
              <Text
                style={[
                  styles.leaveTypeText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {item.leave_type} Leave
              </Text>
              <Badge
                style={[
                  styles.badge,
                  {
                    backgroundColor: statusStyle.color,
                    color: theme.dark ? "#000" : "#fff",
                  },
                ]}
              >
                {item.status.toUpperCase()}
              </Badge>
            </View>
          </View>

          <IconButton
            icon="pencil-outline"
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => openUpdateModal(item)}
          />
        </View>
      </Card>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Dynamic Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onSurface}
          size={24}
          onPress={() => navigation.navigate("LeaveManagement")}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Update Request
        </Text>
        {selectedDates.length > 0 && (
          <Button
            mode="contained"
            compact
            onPress={() => openUpdateModal()}
            style={styles.bulkBtn}
          >
            Update Selected ({selectedDates.length})
          </Button>
        )}
      </View>

      {/* Employee Info Bar */}
      <View
        style={[
          styles.userProfileBar,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        {selectedLeave?.profile_picture ? (
          <Avatar.Image
            size={44}
            source={{ uri: selectedLeave.profile_picture }}
          />
        ) : (
          <Avatar.Text
            size={44}
            label={
              selectedLeave?.employee_name?.substring(0, 2).toUpperCase() || "E"
            }
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        )}
        <View style={styles.userInfo}>
          <Text
            style={[styles.userName, { color: theme.colors.onSurfaceVariant }]}
          >
            {selectedLeave?.employee_name || "Employee"}
          </Text>
          <Text
            style={[styles.userSub, { color: theme.colors.onSurfaceVariant }]}
          >
            Leave Applied On:{" "}
            {new Date(selectedLeave?.applied_on).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      {leaveDatesListLoading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={leaveDates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Update Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={[styles.modalHeading, { color: theme.colors.onSurface }]}
          >
            {isBulkUpdate
              ? `Update ${selectedDates.length} Selected`
              : "Update Status"}
          </Text>
          <Divider style={{ marginVertical: 15 }} />

          <Text
            style={[
              styles.inputLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Leave Type
          </Text>
          <View style={styles.toggleGroup}>
            {["Paid", "Unpaid"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleBtn,
                  { borderColor: theme.colors.outline },
                  leaveTypeValue === t && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setLeaveTypeValue(t)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: theme.colors.onSurfaceVariant },
                    leaveTypeValue === t && { color: theme.colors.onPrimary },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[
              styles.inputLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Status
          </Text>
          <View style={styles.toggleGroup}>
            {["Approved", "Rejected", "Pending"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.toggleBtn,
                  { borderColor: theme.colors.outline },
                  statusValue === s && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setStatusValue(s)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: theme.colors.onSurfaceVariant },
                    statusValue === s && { color: theme.colors.onPrimary },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {statusValue === "Rejected" && (
            <TextInput
              label="Reason for Rejection"
              value={rejectReason}
              onChangeText={setRejectReason}
              mode="outlined"
              multiline
              numberOfLines={5} // Increased for a better text area feel
              placeholder="Please provide a detailed reason..."
              textAlignVertical="top" // Ensures text starts at the top
              style={[
                styles.reasonInput,
                {
                  backgroundColor: theme.colors.surface,
                  minHeight: 120, // Forces a specific height for the "Area" look
                },
              ]}
            />
          )}
          <View style={styles.modalFooter}>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={{ marginLeft: 10 }}
            >
              Apply
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    paddingVertical: 8,
    elevation: 4,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "bold" },
  bulkBtn: { borderRadius: 8 },

  // Profile Bar
  userProfileBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
  },
  userInfo: { marginLeft: 16 },
  userName: { fontSize: 18, fontWeight: "800" },
  userSub: { fontSize: 14 },

  card: { marginBottom: 12, borderRadius: 12 },
  cardRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  calendarContainer: {
    width: 50,
    height: 55,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    marginHorizontal: 8,
  },
  calendarHeader: { paddingVertical: 2, alignItems: "center" },
  calendarMonth: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  calendarBody: { flex: 1, justifyContent: "center", alignItems: "center" },
  calendarDay: { fontSize: 18, fontWeight: "bold" },
  detailsContainer: { flex: 1, marginLeft: 5 },
  commentTitle: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  leaveTypeText: { fontSize: 13, marginRight: 8 },
  badge: { borderRadius: 6, fontWeight: "900", fontSize: 10 },
  modalContent: { padding: 20, margin: 20, borderRadius: 16 },
  modalHeading: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  toggleGroup: { flexDirection: "row", gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  toggleText: { fontWeight: "700" },
  reasonInput: { marginTop: 15 },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 25,
  },
});
