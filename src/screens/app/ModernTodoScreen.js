import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, StatusBar, Vibration } from "react-native";
import { 
  Text, TextInput, Card, useTheme, Checkbox, 
  Avatar, Portal, Modal, Button, IconButton 
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TODO_STORAGE_KEY = "@expo_modern_todo_final";

export default function ModernTodoScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(TODO_STORAGE_KEY);
      if (jsonValue != null) setTasks(JSON.parse(jsonValue));
    } catch (e) { console.error("Load error", e); }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (e) { console.error("Save error", e); }
  };

  const addTask = () => {
    if (!inputText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: inputText,
      completed: false,
      // Using dynamic surface colors for Dark Mode consistency
      color: theme.dark ? theme.colors.surfaceVariant : "#F3E5F5",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    saveTasks([newTask, ...tasks]);
    setInputText("");
  };

  const renderItem = useCallback(({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        {/* Fix: Wrap the content in a View to provide a native ref for measureLayout */}
        <View style={styles.cardWrapper}> 
          <Pressable
            onLongPress={() => {
              Vibration.vibrate(40);
              drag();
            }}
            delayLongPress={250}
            style={({ pressed }) => [
              styles.pressableContainer,
              { 
                backgroundColor: isActive ? theme.colors.elevation.level3 : (pressed ? theme.colors.surfaceDisabled : "transparent"),
                opacity: isActive ? 0.9 : 1,
                borderRadius: 20
              }
            ]}
          >
            <Card 
              style={[
                styles.taskCard, 
                { backgroundColor: isActive ? theme.colors.elevation.level5 : item.color },
                theme.dark && { borderWidth: 1, borderColor: theme.colors.outlineVariant }
              ]}
              elevation={isActive ? 8 : 0}
            >
              <Card.Content style={styles.cardContent}>
                <Checkbox
                  status={item.completed ? "checked" : "unchecked"}
                  onPress={() => {
                    const updated = tasks.map(t => t.id === item.id ? { ...t, completed: !t.completed } : t);
                    saveTasks(updated);
                  }}
                  color={theme.colors.primary}
                />

                <View style={styles.textContainer}>
                  <Text style={[
                    styles.taskTitle, 
                    { color: theme.dark ? theme.colors.onSurface : "#1e293b" },
                    item.completed && styles.completedText
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.taskTime, { color: theme.colors.onSurfaceVariant }]}>
                    {item.time}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <IconButton icon="pencil-outline" size={18} onPress={() => { setEditingTask(item); setEditModalVisible(true); }} />
                  <IconButton icon="trash-can-outline" iconColor={theme.colors.error} size={18} onPress={() => saveTasks(tasks.filter(t => t.id !== item.id))} />
                  <MaterialCommunityIcons name="drag-vertical" size={24} color={theme.colors.onSurfaceVariant} />
                </View>
              </Card.Content>
            </Card>
          </Pressable>
        </View>
      </ScaleDecorator>
    );
  }, [tasks, theme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateSub, { color: theme.colors.secondary }]}>JAN 30, 2026</Text>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>Agenda</Text>
          </View>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            mode="outlined"
            placeholder="Add a task..."
            value={inputText}
            onChangeText={setInputText}
            outlineStyle={{ borderRadius: 15 }}
            style={{ backgroundColor: theme.colors.surface }}
            right={<TextInput.Icon icon="plus" onPress={addTask} />}
          />
        </View>

        <DraggableFlatList
          data={tasks}
          onDragEnd={({ data }) => saveTasks(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />

        <Portal>
          <Modal 
            visible={isEditModalVisible} 
            onDismiss={() => setEditModalVisible(false)} 
            contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
          >
            <Text variant="titleLarge" style={[styles.modalHeading, { color: theme.colors.onSurface }]}>Update Task</Text>
            <TextInput
              mode="outlined"
              value={editingTask?.title}
              onChangeText={(t) => setEditingTask({ ...editingTask, title: t })}
              style={{ backgroundColor: theme.colors.surface }}
            />
            <View style={styles.modalFooter}>
              <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={() => {
                const updated = tasks.map(t => t.id === editingTask.id ? editingTask : t);
                saveTasks(updated);
                setEditModalVisible(false);
              }}>Save Changes</Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24, paddingVertical: 25 },
  dateSub: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: "900" },
  inputBox: { paddingHorizontal: 20, marginBottom: 10 },
  cardWrapper: { marginVertical: 8 },
  pressableContainer: { overflow: 'hidden' },
  taskCard: { borderRadius: 20 },
  cardContent: { flexDirection: "row", alignItems: "center", paddingLeft: 4 },
  textContainer: { flex: 1, marginLeft: 8 },
  taskTitle: { fontSize: 16, fontWeight: "700" },
  completedText: { textDecorationLine: "line-through", opacity: 0.5 },
  taskTime: { fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: "row", alignItems: "center" },
  modal: { padding: 24, margin: 20, borderRadius: 24 },
  modalHeading: { fontWeight: "bold", marginBottom: 15 },
  modalFooter: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, gap: 10 }
});