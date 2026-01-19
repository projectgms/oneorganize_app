import React from "react";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { useThemeMode } from "../context/ThemeModeContext";

export default function AppStatusBar() {
  const theme = useTheme();
  const { statusBarStyle } = useThemeMode();

  return (
    <StatusBar
      style={statusBarStyle} // "light" or "dark"
      translucent={false}
      backgroundColor={theme.colors.surface} // Android only
    />
  );
}
