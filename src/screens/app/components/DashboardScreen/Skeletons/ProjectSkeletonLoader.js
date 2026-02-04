import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78; 
const SPACING = 15;

export const ProjectSkeletonLoader = () => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  // Shimmer animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const SkeletonCard = () => (
    <Animated.View 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.elevation.level2,
          opacity: opacity 
        }
      ]}
    >
      {/* Header Placeholder */}
      <View style={styles.headerRow}>
        <View style={[styles.block, { width: '60%', height: 20, backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.block, { width: 60, height: 20, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant }]} />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

      {/* Progress Bar Placeholder */}
      <View style={styles.progressHeader}>
        <View style={[styles.block, { width: '40%', height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.block, { width: 30, height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
      <View style={[styles.bar, { backgroundColor: theme.colors.surfaceVariant }]} />

      {/* Footer Placeholder */}
      <View style={styles.footerRow}>
        <View style={[styles.block, { width: '35%', height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.block, { width: '35%', height: 12, backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        {/* Title Placeholder */}
        <View style={[styles.block, { width: 120, height: 18, marginBottom: 4, backgroundColor: theme.colors.surfaceVariant }]} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {[1, 2, 3].map((key) => (
          <SkeletonCard key={key} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginVertical: 10 },
  headerContainer: { paddingHorizontal: 4, marginBottom: 8 },
  scrollPadding: { paddingHorizontal: 4, paddingVertical: 12 },
  card: { 
    width: CARD_WIDTH, 
    marginRight: SPACING, 
    borderRadius: 24, 
    padding: 16,
    height: 180, // Matches your actual card height
  },
  block: { borderRadius: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  divider: { height: 1, marginVertical: 14, opacity: 0.2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  bar: { height: 22, borderRadius: 11, width: '100%', marginBottom: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});