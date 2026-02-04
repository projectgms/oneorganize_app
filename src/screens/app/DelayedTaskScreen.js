import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Platform } from 'react-native';
import { Text, useTheme, IconButton, Card, Avatar, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDelayedTaskReq } from "../../store/slices/projectSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

// --- Vertical Task Skeleton ---
const TaskSkeleton = () => {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.taskSkeletonCard, { backgroundColor: theme.colors.elevation.level1, opacity }]}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonBlock, { width: '40%', height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.skeletonBlock, { width: 50, height: 16, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
      <View style={[styles.skeletonBlock, { width: '70%', height: 18, marginVertical: 12, backgroundColor: theme.colors.surfaceVariant }]} />
      <View style={[styles.skeletonBlock, { width: '100%', height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
    </Animated.View>
  );
};

const DelayedTaskScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getDelayedTaskReq());
    }, [dispatch]),
  );

  const projectDelayTaskLoading = useSelector((s) => s.project.loading?.delayTaskLoading);
  const projectDelayData = useSelector((s) => s.project.delayedTaskData);
  const tasksData = projectDelayData || [];

  const border = theme.dark ? "#334155" : "#e5e7eb";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Header with Left-Aligned Title */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
          style={{ marginLeft: 0 }} // Remove default margin for tight left alignment
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Delayed Tasks
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
        {projectDelayTaskLoading ? (
          <View style={{ marginTop: 10 }}>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </View>
        ) : tasksData.length > 0 ? (
          <View style={styles.tasksSection}>
            {tasksData.map((item) => (
              <Card 
                key={item.id} 
                style={[styles.taskCard, { backgroundColor: theme.colors.elevation.level1, borderColor: border }]} 
                mode="elevated"
              >
                <Card.Content>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <MaterialCommunityIcons name="folder-outline" size={14} color={theme.colors.primary} />
                      <Text variant="labelSmall" style={[styles.projectName, { color: theme.colors.primary }]}>
                        {item.project_name?.toUpperCase()}
                      </Text>
                    </View>
                    {item.priority === 'high' && (
                      <Surface style={styles.priorityBadge} elevation={0}>
                         <MaterialCommunityIcons name="alert-circle" size={12} color="#D32F2F" />
                         <Text style={styles.priorityText}>HIGH</Text>
                      </Surface>
                    )}
                  </View>

                  <Text variant="titleMedium" style={styles.taskTitle}>{item.title}</Text>
                  <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                  <View style={styles.footer}>
                    <View style={styles.row}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={14} color="#F44336" />
                      <Text style={styles.dueDate}>Expired: {item.end_date}</Text>
                    </View>
                    <Avatar.Text 
                        size={24} 
                        label={item.assigned_users?.[0]?.name.charAt(0) || 'U'} 
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                        labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="calendar-check-outline" 
              size={64} 
              color={theme.colors.outline} 
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No delayed tasks
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
              Everything is currently on track!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 50 : 5,
    paddingHorizontal: 8, // Added slight padding for better edge breathing
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "900", 
    textAlign: 'left', // Aligns text to the left
    marginLeft: 4,     // Spacing from the back icon
  },
  tasksSection: { paddingHorizontal: 18, marginTop: 10 },
  taskCard: { marginBottom: 16, borderRadius: 14, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectName: { marginLeft: 6, fontWeight: '800' },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 9, fontWeight: '900', color: '#D32F2F', marginLeft: 4 },
  taskTitle: { fontWeight: 'bold' },
  description: { marginTop: 4, opacity: 0.7, lineHeight: 18 },
  divider: { height: 1, marginVertical: 12, opacity: 0.2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dueDate: { marginLeft: 6, fontSize: 11, color: '#F44336', fontWeight: 'bold' },
  taskSkeletonCard: { marginHorizontal: 18, marginBottom: 16, borderRadius: 14, padding: 16, height: 130 },
  skeletonBlock: { borderRadius: 4 },
  skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, marginTop: -40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '700' },
});

export default DelayedTaskScreen;