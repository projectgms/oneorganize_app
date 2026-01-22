import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Card, useTheme } from "react-native-paper";

export function NotificationSkeletonCard({ style }) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const blockColor = theme.colors.surfaceVariant || theme.colors.surface;
  const border = theme.colors.outlineVariant || theme.colors.outline || "#e5e7eb";
  const cardBg = theme.dark
    ? theme.colors.elevation?.level1 || theme.colors.surface
    : theme.colors.surface;

  const Block = ({ w, h, r = 8, mt = 0 }) => (
    <Animated.View
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginTop: mt,
        backgroundColor: blockColor,
        opacity: pulse,
      }}
    />
  );

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor: border },
        style,
      ]}
    >
      <View style={styles.inner}>
        {/* Left icon box */}
        <Animated.View
          style={[
            styles.iconWrap,
            { backgroundColor: blockColor, opacity: pulse },
          ]}
        />

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Block w={"65%"} h={16} r={6} />
            <Block w={58} h={12} r={6} />
          </View>

          {/* Description lines */}
          <Block w={"92%"} h={13} r={6} mt={10} />
          <Block w={"75%"} h={13} r={6} mt={8} />

          {/* Chips */}
          <View style={styles.chipsRow}>
            <Block w={140} h={28} r={999} mt={10} />
            <Block w={160} h={28} r={999} mt={10} />
          </View>
        </View>
      </View>
    </Card>
  );
}

export function NotificationSkeletonList({ count = 6 }) {
  return (
    <View style={{ padding: 16, paddingBottom: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeletonCard key={i} style={{ marginBottom: 10 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 0,
  },
  inner: {
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12, // if your RN doesn't support gap, replace with marginLeft
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
