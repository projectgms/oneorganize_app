import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";
import { useAppData } from "../../context/AppDataContext";

const statusColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  if (s === "Cancelled") return "default";
  return "info";
};

export default function LeaveManagementScreen() {
  const { leaves, cancelLeave, setLeaveStatus } = useAppData();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      {leaves.map((l) => (
        <Card key={l.id} style={{ marginBottom: 12 }}>
          <Card.Title title={l.type} subtitle={`${l.from} → ${l.to}`} />
          <Card.Content>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Chip>{l.status}</Chip>
              <Text style={{ opacity: 0.7 }}>Reason: {l.reason}</Text>
            </View>

            <View style={{ height: 12 }} />

            {l.status === "Pending" ? (
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Button mode="outlined" onPress={() => cancelLeave(l.id)}>Cancel</Button>
                <Button mode="contained" onPress={() => setLeaveStatus(l.id, "Approved")}>Approve (demo)</Button>
                <Button mode="contained-tonal" onPress={() => setLeaveStatus(l.id, "Rejected")}>Reject (demo)</Button>
              </View>
            ) : (
              <Text style={{ opacity: 0.7 }}>No actions available.</Text>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
