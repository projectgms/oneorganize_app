import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../apiClient";

export default function NewDirectChatScreen({ auth, navigation }) {
  const { user, token } = auth;
  const [users, setUsers] = useState([]);
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

  const startDirectChat = async (otherUser) => {
    try {
      const res = await api.post(
        "/conversations",
        {
          is_group: false,
          title: null,
          participantIds: [user.id, otherUser.id],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigation.replace("Chat", {
        conversationId: res.data.id,
        title: otherUser.name || `Chat #${res.data.id}`,
      });
    } catch (err) {
      console.log("Create direct chat error:", err.response?.data || err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => startDirectChat(item)}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  userRow: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginBottom: 8,
  },
  userName: { fontSize: 16, fontWeight: "600" },
  userEmail: { fontSize: 12, color: "#64748b" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#64748b" },
});
