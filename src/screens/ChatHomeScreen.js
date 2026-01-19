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
import { useFocusEffect } from "@react-navigation/native";

export default function ChatHomeScreen({ auth, navigation }) {
  const { token, user } = auth;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.log(
        "Load conversations error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [token])
  );

  const getConversationTitle = (item) => {
    if (item.project_id) return item.title || `Project Chat #${item.id}`;
    if (item.is_group) return item.title || `Group #${item.id}`;
    if (item.other_user_name) return item.other_user_name;
    return item.title || `Direct Chat #${item.id}`;
  };

  // 👉 helper to compute the avatar letter
  const getAvatarLetter = (item) => {
    // for direct chat, prefer other user's name
    if (!item.is_group && item.other_user_name) {
      return item.other_user_name.charAt(0).toUpperCase();
    }

    // fallback: use first letter of computed title
    const title = getConversationTitle(item);
    return title?.charAt(0)?.toUpperCase() || "?";
  };

  const renderItem = ({ item }) => {
    const title = getConversationTitle(item);
    const avatarLetter = getAvatarLetter(item);

    return (
      <TouchableOpacity
        style={styles.conversation}
        onPress={() =>
          navigation.navigate("Chat", {
            conversationId: item.id,
            title,
          })
        }
      >
        <View style={styles.conversationRow}>
          {/* Circle avatar with first letter */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          {/* Text content */}
          <View style={styles.conversationTextContainer}>
            <Text style={styles.conversationTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.conversationMeta} numberOfLines={1}>
              Last activity:{" "}
              {new Date(item.last_activity_at || item.created_at).toLocaleString()}
            </Text>
            {item.project_id ? (
              <Text style={styles.badge}>Project Chat</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NewDirectChat")}
        >
          <Text style={styles.buttonText}>New Direct Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NewGroupChat")}
        >
          <Text style={styles.buttonText}>New Group Chat</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No conversations yet. Create one!
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },

  conversation: {
    padding: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginBottom: 8,
  },
  conversationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // 👇 avatar styles
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  conversationTextContainer: {
    flex: 1,
  },
  conversationTitle: { fontSize: 16, fontWeight: "600" },
  conversationMeta: { fontSize: 12, color: "#64748b", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#64748b" },
  badge: {
    marginTop: 4,
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "600",
  },
});
