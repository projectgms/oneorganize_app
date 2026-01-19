import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import laravelApi from "../laravelApiClient";
import api from "../apiClient";

const STATUS_LABELS = {
  not_started: "Not Started",
  in_progress: "In Progress",
  on_hold: "On Hold",
  completed: "Completed",
};

export default function ProjectsScreen({ auth, navigation }) {
  const { token } = auth;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await laravelApi.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log("Load projects error:", err.response?.data || err.message);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openProjectChat = async (project) => {
    try {
      const res = await api.post(
        `/projects/${project.id}/chat`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const convo = res.data;

      navigation.navigate("ChatTab", {
        screen: "Chat",
        params: {
          conversationId: convo.id,
          title: project.name,
        },
      });
    } catch (err) {
      console.log("Open project chat error:", err.response?.data || err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      <View style={styles.row}>
        <Text style={styles.label}>Status: </Text>
        <Text style={[styles.value, styles.status]}>
          {STATUS_LABELS[item.status] || item.status}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Progress: </Text>
        <Text style={styles.value}>{item.progress}%</Text>
      </View>
      {item.owner && (
        <View style={styles.row}>
          <Text style={styles.label}>Owner: </Text>
          <Text style={styles.value}>{item.owner.name}</Text>
        </View>
      )}
      {item.due_date && (
        <View style={styles.row}>
          <Text style={styles.label}>Due: </Text>
          <Text style={styles.value}>
            {new Date(item.due_date).toLocaleDateString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => openProjectChat(item)}
      >
        <Text style={styles.chatButtonText}>Open Project Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && (
        <FlatList
          data={projects}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No projects found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  description: { fontSize: 13, color: "#475569", marginBottom: 6 },
  row: { flexDirection: "row", marginTop: 2 },
  label: { fontSize: 12, color: "#64748b" },
  value: { fontSize: 12, color: "#0f172a" },
  status: { fontWeight: "600" },
  error: { color: "red", marginTop: 10 },
  emptyText: { marginTop: 20, textAlign: "center", color: "#64748b" },
  chatButton: {
    marginTop: 10,
    backgroundColor: "#0f172a",
    borderRadius: 6,
    paddingVertical: 8,
  },
  chatButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
});
