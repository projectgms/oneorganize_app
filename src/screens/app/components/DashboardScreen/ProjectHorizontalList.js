import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78; 
const SPACING = 15;

export const ProjectHorizontalList = ({ projectListData }) => {
  const theme = useTheme();

  // Status mapping and colors
  const statusConfig = {
    done: { color: '#4CAF50', label: 'DONE' },
    inprogress: { color: '#2196F3', label: 'IN PROGRESS' },
    review: { color: '#FF9800', label: 'REVIEW' },
    todo: { color: '#9E9E9E', label: 'TODO' },
    delay: { color: '#F44336', label: 'DELAY' },
  };

  const MultiSegmentBar = ({ task }) => {
    const total = parseInt(task.total) || 1;
    
    return (
      <View style={[styles.barContainer, { backgroundColor: theme.dark ? '#333' : '#F0F0F0' }]}>
        {Object.keys(statusConfig).map((key) => {
          const val = parseInt(task[key]) || 0;
          if (val === 0) return null;
          
          const widthPct = (val / total) * 100;
          
          return (
            <View 
              key={key} 
              style={[styles.segment, { width: `${widthPct}%`, backgroundColor: statusConfig[key].color }]}
            >
              {widthPct > 15 ? (
                <Text variant="labelSmall" style={styles.segmentText} numberOfLines={1} adjustsFontSizeToFit>
                  {statusConfig[key].label}: {val}
                </Text>
              ) : widthPct > 8 ? (
                <Text variant="labelSmall" style={styles.segmentText}>
                  {val}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Title Section */}
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={[styles.mainTitle, { color: theme.colors.onBackground }]}>
          Project Status
        </Text>
      </View>

      {/* Conditional Rendering for Empty State */}
      {projectListData?.data?.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollPadding}
        >
          {projectListData.data?.map((project) => (
            <Card 
              key={project.id} 
              style={[styles.card, { backgroundColor: theme.colors.elevation.level2 }]}
              mode="elevated"
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={styles.projectName} numberOfLines={1}>
                      {project.name}
                    </Text>
                  </View>
                  <Surface 
                    style={[styles.statusBadge, { 
                        backgroundColor: project.status === 'Complete' ? '#E8F5E9' : theme.colors.primaryContainer 
                    }]} 
                    elevation={0}
                  >
                    <Text style={{ 
                        fontSize: 10, 
                        fontWeight: '900', 
                        color: project.status === 'Complete' ? '#2E7D32' : theme.colors.onPrimaryContainer 
                    }}>
                      {project.status.toUpperCase()}
                    </Text>
                  </Surface>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                <View style={styles.sectionHeader}>
                  <Text variant="labelSmall" style={styles.sectionTitle}>TASK DISTRIBUTION</Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {project.percentage}%
                  </Text>
                </View>

                <MultiSegmentBar task={project.task} />

                <View style={styles.footer}>
                  <View style={styles.footerItem}>
                    <MaterialCommunityIcons name="calendar-clock" size={14} color={theme.colors.outline} />
                    <Text variant="labelSmall" style={styles.footerText}>
                       Ends: {new Date(project.end_date).toLocaleDateString('en-GB')}
                    </Text>
                  </View>
                  <View style={styles.footerItem}>
                    <MaterialCommunityIcons name="account-group" size={14} color={theme.colors.outline} />
                    <Text variant="labelSmall" style={styles.footerText}>
                      {project.users?.length || 0} Members
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        /* Empty State UI */
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="clipboard-text-off-outline" 
            size={48} 
            color={theme.colors.outline} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            No projects assigned
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginVertical: 4 },
  headerContainer: { paddingHorizontal: 4, marginBottom: 0 },
  mainTitle: { fontWeight: '900', letterSpacing: -0.5, fontSize: 16 },
  scrollPadding: { paddingHorizontal: 0, paddingVertical: 12 },
  card: { width: CARD_WIDTH, marginRight: SPACING, borderRadius: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectName: { fontWeight: '900' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  divider: { height: 1, marginVertical: 14, opacity: 0.2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { letterSpacing: 1, fontWeight: 'bold', opacity: 0.6 },
  barContainer: { height: 22, borderRadius: 11, flexDirection: 'row', overflow: 'hidden', marginBottom: 10 },
  segment: { height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)' },
  segmentText: { color: '#FFF', fontWeight: '900', fontSize: 9, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, paddingTop: 0, borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { marginLeft: 4, color: '#64748b' },
  /* Empty State Styles */
  emptyContainer: { 
    height: 150, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(150,150,150,0.3)'
  },
  emptyText: { marginTop: 12, fontSize: 14, fontWeight: '600', opacity: 0.8 },
});