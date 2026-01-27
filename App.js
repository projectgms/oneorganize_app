import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider, useDispatch, useSelector } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { AppDataProvider } from "./src/context/AppDataContext";
import { store } from "./src/store";
import Toast from "react-native-toast-message";
import { ThemeModeProvider, useThemeMode } from "./src/context/ThemeModeContext";
import AppStatusBar from "./src/components/AppStatusBar";

import { addPushListeners } from "./src/services/pushNotifications";
import { syncPushTokenToServer } from "./src/utils/pushTokenSync";
import { fetchHrmOverviewRequest } from "./src/store/slices/hrmSlice";

const linking = {
  prefixes: [
    "oneorganize://",
    "https://one-organize-2.netlify.app",
    Linking.createURL("/"),
  ],
  config: { screens: { ResetPassword: "reset-password" } },
};

function PushBootstrap() {
  const dispatch = useDispatch();
  const authToken = useSelector((s) => s.auth.token);

  const pendingTapRef = useRef(null);

  const refresh = () => dispatch(fetchHrmOverviewRequest());

  // ✅ login ke baad token sync
  useEffect(() => {
    if (!authToken) return;
    syncPushTokenToServer();
  }, [authToken]);

  // ✅ listeners
  useEffect(() => {
    const unsub = addPushListeners({
      onReceive: () => {
        // foreground me
        if (authToken) refresh();
      },
      onTap: (resp) => {
        // background/terminated tap
        if (!authToken) {
          pendingTapRef.current = resp;
          return;
        }
        refresh();
      },
    });
    return unsub;
  }, [authToken, dispatch]);

  // ✅ killed state: app open by tapping notification
  useEffect(() => {
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) pendingTapRef.current = last;

      if (authToken && pendingTapRef.current) {
        refresh();
        pendingTapRef.current = null;
      }
    })();
  }, [authToken, dispatch]);

  // ✅ auth late aaya to pending tap replay
  useEffect(() => {
    if (authToken && pendingTapRef.current) {
      refresh();
      pendingTapRef.current = null;
    }
  }, [authToken, dispatch]);

  return null;
}

function AppShell() {
  const { paperTheme, navTheme } = useThemeMode();

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <AppDataProvider>
          <NavigationContainer linking={linking} theme={navTheme}>
            <AppStatusBar />
            <PushBootstrap />
            <RootNavigator />
          </NavigationContainer>
          <Toast />
        </AppDataProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeModeProvider>
          <AppShell />
        </ThemeModeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
