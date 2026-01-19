import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, HelperText, Snackbar, TextInput, SegmentedButtons } from "react-native-paper";
import { useAppData } from "../../context/AppDataContext";

export default function ApplyLeaveScreen() {
  const { addLeave } = useAppData();

  const [type, setType] = useState("Casual Leave");
  const [from, setFrom] = useState("2026-01-16");
  const [to, setTo] = useState("2026-01-16");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = () => {
    setErr("");
    if (!type || !from || !to) return setErr("Type, From, To are required");
    addLeave({ type, from, to, reason: reason || "-" });
    setOk(true);
    setReason("");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Card>
        <Card.Title title="Apply Leave" subtitle="Dummy submit will add a Pending leave" />
        <Card.Content>
          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={[
              { value: "Casual Leave", label: "Casual" },
              { value: "Sick Leave", label: "Sick" },
              { value: "Work From Home", label: "WFH" },
            ]}
          />

          <View style={{ height: 12 }} />
          <TextInput label="From (YYYY-MM-DD)" value={from} onChangeText={setFrom} />
          <View style={{ height: 12 }} />
          <TextInput label="To (YYYY-MM-DD)" value={to} onChangeText={setTo} />
          <View style={{ height: 12 }} />
          <TextInput
            label="Reason"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />

          <HelperText type="error" visible={!!err}>{err}</HelperText>

          <Button mode="contained" onPress={onSubmit}>
            Submit Leave
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={ok} onDismiss={() => setOk(false)} duration={2000}>
        Leave applied (Pending)
      </Snackbar>
    </ScrollView>
  );
}
