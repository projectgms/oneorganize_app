import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import * as Linking from "expo-linking";

import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { AppDataProvider } from "./src/context/AppDataContext";
import { paperTheme } from "./src/theme/paperTheme";
import { store } from "./src/store";

// ✅ Deep linking config
const linking = {
  prefixes: [
    "oneorganize://", // custom scheme (works in dev build / production build)
    "https://one-organize-2.netlify.app", // if you later enable universal links/app links
    Linking.createURL("/"), // for Expo dev URLs
  ],
  config: {
    screens: {
      ResetPassword: "reset-password", // must match your screen name in navigator
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <AppDataProvider>
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
          </AppDataProvider>
        </AuthProvider>
      </PaperProvider>
    </Provider>
  );
}
