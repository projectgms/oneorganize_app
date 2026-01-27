import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export function EmptyPeopleCard({
  title = "No Updates Today",
  subtitle = "No one on leave, birthday, or anniversary today.",
  imageSource,
}) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.background }]} mode="contained">
      <Card.Content style={styles.content}>
        {!!imageSource && (
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
        )}

        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0, // ✅ no border
    elevation: 0,   // ✅ no shadow
  },
  content: {
    alignItems: "center",
    paddingVertical: 18,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
  },
});
