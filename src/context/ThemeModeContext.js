import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from "@react-navigation/native";

const KEY = "theme_mode";
const ThemeModeContext = createContext(null);

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
};

export function ThemeModeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState("system");
  const [loadingMode, setLoadingMode] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(KEY);
        if (saved === "light" || saved === "dark" || saved === "system") setMode(saved);
      } finally {
        setLoadingMode(false);
      }
    })();
  }, []);

  const effectiveScheme = mode === "system" ? (systemScheme ?? "light") : mode;

  const paperTheme = useMemo(() => {
    const base = effectiveScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
    return { ...base, colors: { ...base.colors } };
  }, [effectiveScheme]);

  // ✅ Navigation Theme (Drawer/Tab backgrounds etc.)
  const navTheme = useMemo(() => {
    const base = effectiveScheme === "dark" ? NavDarkTheme : NavLightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: paperTheme.colors.background,
        card: paperTheme.colors.surface,
        title: paperTheme.colors.onSurface,
        border: paperTheme.colors.outlineVariant,
        primary: paperTheme.colors.primary,
        notification: paperTheme.colors.error,
      },
    };
  }, [effectiveScheme, paperTheme]);

  const statusBarStyle = effectiveScheme === "dark" ? "light" : "dark";

  const updateMode = async (nextMode) => {
    setMode(nextMode);
    try {
      await SecureStore.setItemAsync(KEY, nextMode);
    } catch (e) {}
  };

  const value = useMemo(
    () => ({
      mode,
      effectiveScheme,
      paperTheme,
      navTheme,          // ✅ expose this
      statusBarStyle,
      setMode: updateMode,
      loadingMode,
    }),
    [mode, effectiveScheme, paperTheme, navTheme, statusBarStyle, loadingMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}
