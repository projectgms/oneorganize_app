import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Card, useTheme } from "react-native-paper";

export default function OnLeaveTodaySkeleton({ style }) {
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

  const Block = ({ w, h, r = 10, mt = 0 }) => (
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
        {
          backgroundColor: theme.colors.background,
          elevation: 0,
          borderRadius: 14,
        },
        style,
      ]}
    >
      <Card.Content>
        {/* Title */}
        <Block w={140} h={18} r={6} />

        <View style={{ height: 12 }} />

        {/* Avatar + text */}
        <View style={styles.row}>
          <Animated.View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: blockColor,
              opacity: pulse,
            }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Block w={"55%"} h={14} r={6} />
            <Block w={"35%"} h={12} r={6} mt={8} />
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Chips row */}
        <View style={styles.chipsRow}>
          <Block w={120} h={34} r={18} />
          <Block w={200} h={34} r={18} />
        
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10, // RN 0.71+; if not supported, replace with margins
  },
});
