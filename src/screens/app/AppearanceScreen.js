import React from "react";
import { View } from "react-native";
import { Card, RadioButton, Text, useTheme } from "react-native-paper";
import { useThemeMode } from "../../context/ThemeModeContext";

export default function AppearanceScreen() {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title="Appearance" subtitle="Choose your theme" />
        <Card.Content>
          <RadioButton.Group onValueChange={setMode} value={mode}>
            <RadioButton.Item label="System default" value="system" />
            <RadioButton.Item label="Light mode" value="light" />
            <RadioButton.Item label="Dark mode" value="dark" />
          </RadioButton.Group>

          <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
            System default follows your phone theme automatically.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
