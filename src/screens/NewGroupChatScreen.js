import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native";
import api from "../apiClient";

export default function NewGroupChatScreen({ auth, navigation }) {
  const { user, token } = auth;
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.filter((u) => u.id !== user.id));
    } catch (err) {
      console.log("Load users error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedIds.length === 0) return;
    try {
      const res = await api.post(
        "/conversations",
        {
          is_group: true,
          title: groupName.trim(),
          participantIds: [user.id, ...selectedIds],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigation.replace("Chat", {
        conversationId: res.data.id,
        title: res.data.title || `Group #${res.data.id}`,
      });
    } catch (err) {
      console.log("Create group chat error:", err.response?.data || err.message);
    }
  };

  const renderItem = ({ item }) => {
    const selected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.userRow, selected && styles.userRowSelected]}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {selected && <Text style={styles.selectedLabel}>Selected</Text>}
      </TouchableOpacity>
    );
  };

  const canCreate = groupName.trim().length > 0 && selectedIds.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.label}>Select Members</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No other users found.</Text>
          }
          style={{ flex: 1 }}
        />
      )}

      <Button
        title="Create Group"
        onPress={createGroup}
        disabled={!canCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  label: { fontSize: 14, marginTop: 8, marginBottom: 4, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  userRow: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginBottom: 8,
  },
  userRowSelected: {
    borderColor: "#0f172a",
    borderWidth: 2,
  },
  userName: { fontSize: 16, fontWeight: "600" },
  userEmail: { fontSize: 12, color: "#64748b" },
  selectedLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
  emptyText: { textAlign: "center", marginTop: 20, color: "#64748b" },
});
