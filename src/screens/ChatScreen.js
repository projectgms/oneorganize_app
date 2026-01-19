// src/screens/ChatScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { io } from "socket.io-client";
import api from "../apiClient";

const BACKEND_URL = "http://172.20.10.2:4000";

export default function ChatScreen({ auth, conversationId, conversationTitle }) {
  const { user, token } = auth;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  /* ---------- Load history ---------- */
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.get(
          `/conversations/${conversationId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.log("Load messages error:", err.response?.data || err.message);
      }
    };
    loadMessages();
  }, [token, conversationId]);

  /* ---------- Socket connection ---------- */
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join_conversation", conversationId);
      socket.emit("mark_conversation_read", conversationId); // for double tick
    });

    socket.on("new_message", ({ conversationId: msgConvoId, message }) => {
      if (msgConvoId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("message_edited", ({ conversationId: msgConvoId, message }) => {
      if (msgConvoId === conversationId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? message : m))
        );
      }
    });

    socket.on("message_deleted", ({ conversationId: msgConvoId, messageId }) => {
      if (msgConvoId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, is_deleted: 1 } : m
          )
        );
      }
    });

    socket.on("messages_read", ({ conversationId: msgConvoId }) => {
      if (msgConvoId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_id === user.id ? { ...m, status: 2 } : m
          )
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [token, conversationId, user.id]);

  /* ---------- Send / edit message ---------- */
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const socket = socketRef.current;
    if (!socket) return;

    if (editingMessage) {
      socket.emit("edit_message", {
        messageId: editingMessage.id,
        conversationId,
        content: trimmed,
      });
      setEditingMessage(null);
      setText("");
    } else {
      socket.emit("send_message", {
        conversationId,
        content: trimmed,
      });
      setText("");
    }
  };

  /* ---------- Long press actions ---------- */
  const openMessageActions = (message, isMine) => {
    if (!isMine || message.is_deleted) return;

    Alert.alert("Message options", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
        onPress: () => {
          setEditingMessage(message);
          setText(message.content);
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const socket = socketRef.current;
          if (!socket) return;
          socket.emit("delete_message", {
            messageId: message.id,
            conversationId,
          });
        },
      },
    ]);
  };

  /* ---------- Ticks (sent / read) ---------- */
  const renderTicks = (msg) => {
    if (msg.sender_id !== user.id || msg.is_deleted) return null;
    if (msg.status === 2) {
      return <Text style={[styles.ticks, styles.ticksRead]}>✓✓</Text>; // double tick
    }
    return <Text style={styles.ticks}>✓</Text>; // single tick
  };

  /* ---------- Row render ---------- */
  const renderItem = ({ item }) => {
    const isMine = item.sender_id === user.id;
    const messageText = item.is_deleted ? "Message deleted" : item.content;

    return (
      <View style={styles.messageRow}>
        {!isMine && (
          <View style={{ width: 40 }} />
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          onLongPress={() => openMessageActions(item, isMine)}
          style={[
            styles.bubbleWrapper,
            isMine ? styles.bubbleWrapperMine : styles.bubbleWrapperTheirs,
          ]}
        >
          {!isMine && !item.is_deleted && (
            <Text style={styles.senderName}>{item.sender_name}</Text>
          )}

          <View
            style={[
              styles.messageBubble,
              isMine ? styles.mine : styles.theirs,
              item.is_deleted && styles.messageDeletedBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.is_deleted && styles.deletedText,
              ]}
            >
              {messageText}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.timeText}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {item.edited_at ? "  (edited)" : ""}
              </Text>
              {renderTicks(item)}
            </View>
          </View>
        </TouchableOpacity>

        {isMine && (
          <View style={{ width: 40 }} />
        )}
      </View>
    );
  };

  const title = conversationTitle || `Conversation #${conversationId}`;

  /* ---------- Auto scroll to bottom when new messages ---------- */
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {editingMessage && (
          <Text style={styles.editingBadge}>
            Editing... tap Send to save
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No messages yet. Say hi 👋
            </Text>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={
              editingMessage ? "Edit message..." : "Type a message..."
            }
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !text.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Text style={styles.sendButtonText}>
              {editingMessage ? "SAVE" : "SEND"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  editingBadge: {
    marginTop: 4,
    fontSize: 12,
    color: "#f97316",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    color: "#9ca3af",
    fontSize: 14,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  bubbleWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  bubbleWrapperMine: {
    justifyContent: "flex-end",
  },
  bubbleWrapperTheirs: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mine: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  theirs: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageDeletedBubble: {
    backgroundColor: "#e5e7eb",
  },
  senderName: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 4,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: "#111827",
  },
  deletedText: {
    fontStyle: "italic",
    color: "#6b7280",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: "#6b7280",
  },
  ticks: {
    fontSize: 11,
    marginLeft: 6,
    color: "#4b5563",
  },
  ticksRead: {
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#f9fafb",
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
