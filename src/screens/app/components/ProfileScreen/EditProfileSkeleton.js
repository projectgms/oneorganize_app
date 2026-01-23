import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Card, useTheme } from "react-native-paper";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

export function EditProfileSkeleton() {
  const theme = useTheme();
  const pulse = new Animated.Value(0.4);

  // Pulsing animation
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 0.8,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 0.4,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const backgroundColor = theme.colors.surfaceVariant || theme.colors.surface;
  const borderColor = theme.colors.outlineVariant || theme.colors.outline || "#e5e7eb";
  const iconColor = theme.colors.primary;

  const Block = ({ width, height, borderRadius = 8, marginTop = 0 }) => (
    <Animated.View
      style={{
        width,
        height,
        backgroundColor,
        borderRadius,
        marginTop,
        opacity: pulse,
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Block width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Block width="70%" height={18} borderRadius={8} />
          <Block width="40%" height={12} borderRadius={6} marginTop={6} />
        </View>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
        <Card.Content>
          {/* Avatar Skeleton */}
          <View style={styles.avatarWrap}>
            <Block width={96} height={96} borderRadius={48} />
            {/* <View style={styles.editBadge}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={18}
                color="#fff"
              />
            </View> */}
          </View>

          {/* Name input skeleton */}
          {/* <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Name
          </Text> */}
          <Block width="60%" height={40} borderRadius={8} marginTop={6} />

          {/* Buttons Skeleton */}
          <Block width="100%" height={48} borderRadius={10} marginTop={14} />
          <Block width="100%" height={48} borderRadius={10} marginTop={12} />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 10,
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },

  card: {
    borderRadius: 14,
    elevation: 0,
    marginVertical: 8,
  },

  avatarWrap: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    position: "relative",
  },

  editBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  label: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.75,
  },
});
