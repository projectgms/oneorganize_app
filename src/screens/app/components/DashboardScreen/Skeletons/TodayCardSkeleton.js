import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Card, useTheme, ProgressBar } from "react-native-paper";

export default function TodayCardSkeleton({ style }) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const bg = theme.colors.surfaceVariant || theme.colors.surface;

  const Block = ({ w, h, r = 8, mt = 0 }) => (
    <Animated.View
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginTop: mt,
        backgroundColor: bg,
        opacity: pulse,
      }}
    />
  );

  return (
    <Card
      style={[
        {
          marginBottom: 12,
          backgroundColor: theme.colors.background,
          elevation: 0,
        },
        style,
      ]}
    >
      <Card.Content>
        {/* Header row */}
        <View style={styles.rowBetween}>
          <Block w={70} h={18} r={6} />
          <Block w={90} h={16} r={6} />
        </View>

        <View style={{ height: 10 }} />

        {/* Note text */}
        <Block w={"85%"} h={14} r={6} />
        <Block w={"65%"} h={14} r={6} mt={8} />

        <View style={{ height: 16 }} />

        {/* Worked / Break row */}
        <View style={styles.rowBetween}>
          <Block w={130} h={20} r={8} />
          <Block w={110} h={20} r={8} />
        </View>

        <View style={{ height: 10 }} />

        {/* Progress */}
        <Animated.View style={{ opacity: pulse }}>
          <ProgressBar progress={0.45} />
        </Animated.View>

        {/* Footer labels */}
        <View style={[styles.rowBetween, { marginTop: 6 }]}>
          <Block w={50} h={14} r={6} />
          <Block w={90} h={14} r={6} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
