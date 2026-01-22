import React, { useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Button,
  Card,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppData } from "../../context/AppDataContext";
import { createLeaveReq } from "./../../store/slices/leaveManageSlice";
import { useDispatch, useSelector } from "react-redux";

const durationOptions = [
  { label: "2 Hours Leave", value: "2_hours" },
  { label: "First Half", value: "first_half" },
  { label: "Full Day", value: "full_day" },
  { label: "Multiple", value: "multiple" },
  { label: "Second Half", value: "second_half" },
];

export default function ApplyLeaveScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.leaveManage);
  const user = useSelector((s) => s.auth.user);

  console.log("user data: ",user)

  const { addLeave } = useAppData();

  const [duration, setDuration] = useState("multiple");
  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null); // Date | null
  const [reason, setReason] = useState("");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const startLabel = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const endLabel = endDate ? format(endDate, "yyyy-MM-dd") : "";

  const isMultiple = duration === "multiple";

  const canCreate = useMemo(() => {
    if (!duration) return false;
    if (!startDate) return false;
    if (isMultiple && !endDate) return false;
    return true;
  }, [duration, startDate, endDate, isMultiple]);

  const onCreate = () => {
    setErr("");

    if (!canCreate) {
      setErr("Please fill required fields.");
      return;
    }

    setSaving(true);
    try {
      addLeave({
        duration,
        from: startLabel,
        to: isMultiple ? endLabel : startLabel,
        reason: reason || "-",
      });

      dispatch(
        createLeaveReq({
          employee_id: user?.id,
          duration: duration,
          start_date: startLabel,
          end_date: isMultiple ? endLabel : startLabel,
          leave_reason: reason,
        }),
      );

      // reset (optional)
      setDuration(null);
      setStartDate(null);
      setEndDate(null)
      setReason("");
      // navigation?.goBack?.();
    } finally {
      setSaving(false);
    }
  };

  const fieldBg = theme.dark ? "#1f2937" : "#ffffff";
  const border = theme.dark ? "#334155" : "#e5e7eb";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Create Leave
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
        <Card.Content>
          {/* Row: Duration + Start Date */}
          <View style={[styles.row, { marginVertical: 12 }]}>
            {/* Duration dropdown */}
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Duration
              </Text>

              <Dropdown
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: border,
                  },
                ]}
                data={durationOptions}
                labelField="label"
                valueField="value"
                value={duration}
                onChange={(item) => {
                  setDuration(item.value);
                  if (item.value !== "multiple") setEndDate(null);
                }}
                placeholder="Select duration"
                placeholderStyle={[
                  styles.placeholder,
                  { color: theme.colors.onSurface },
                ]}
                selectedTextStyle={[
                  styles.selectedText,
                  { color: theme.colors.onSurface },
                ]}
                itemTextStyle={{ color: "#5D3FD3" }}
                containerStyle={[
                  styles.dropdownMenu,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: border,
                  },
                ]}
                renderRightIcon={() => (
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color={theme.colors.onSurface}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Start Date
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setOpenStart(true)}
                style={[
                  styles.dateBox,
                  { backgroundColor: fieldBg, borderColor: border },
                ]}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    opacity: startLabel ? 1 : 0.6,
                  }}
                >
                  {startLabel || "Select date"}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={18}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: 12 }} />

            {isMultiple && <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                End Date
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setOpenEnd(true)}
                style={[
                  styles.dateBox,
                  { backgroundColor: fieldBg, borderColor: border },
                ]}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    opacity: endLabel ? 1 : 0.6,
                  }}
                >
                  {endLabel || "Select date"}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={18}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>}
          </View>

          {/* Reason */}
          <View style={{ marginTop: 14 }}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Leave Reason
            </Text>

            <TextInput
              mode="outlined"
              value={reason}
              onChangeText={setReason}
              placeholder="Enter leave reason"
              multiline
              numberOfLines={5}
              style={{ minHeight: 120, padding: 6 }}
              outlineStyle={{ borderRadius: 10 }}
            />
          </View>

          <HelperText type="error" visible={!!err} style={{ marginTop: 6 }}>
            {err}
          </HelperText>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={() => navigation?.goBack?.()}
              contentStyle={{ height: 44 }}
              style={{ borderRadius: 10, borderColor: border }}
              labelStyle={{ fontWeight: "700", color: theme.colors.onSurface }}
            >
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={onCreate}
              loading={loading?.createLeaveLoading}
              disabled={saving || !canCreate}
              contentStyle={{ height: 44 }}
              style={{ borderRadius: 10 }}
              labelStyle={{ fontWeight: "800" }}
            >
              Create
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Start date modal */}
      <DatePickerModal
        locale="enGB"
        mode="single"
        visible={openStart}
        onDismiss={() => setOpenStart(false)}
        date={startDate || new Date()}
        onConfirm={({ date }) => {
          setOpenStart(false);
          setStartDate(date);
          if (endDate && date && endDate < date) setEndDate(null);
        }}
      />

      {/* End date modal */}
      <DatePickerModal
        locale="enGB"
        mode="single"
        visible={openEnd}
        onDismiss={() => setOpenEnd(false)}
        date={endDate || startDate || new Date()}
        onConfirm={({ date }) => {
          setOpenEnd(false);
          setEndDate(date);
        }}
        validRange={startDate ? { startDate } : undefined}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  card: { borderRadius: 14, elevation: 0, marginHorizontal: 18 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "flex-start" },
  label: { fontSize: 12, opacity: 0.75, marginBottom: 6 },

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
  selectedText: { fontSize: 14 },

  dateBox: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
    gap: 10, // if your RN doesn't support gap, replace with marginLeft on second button
  },
});
