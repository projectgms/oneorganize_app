// import "react-native-gesture-handler";
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { Provider as PaperProvider } from "react-native-paper";
// import { Provider } from "react-redux";
// import * as Linking from "expo-linking";

// import RootNavigator from "./src/navigation/RootNavigator";
// import { AuthProvider } from "./src/context/AuthContext";
// import { AppDataProvider } from "./src/context/AppDataContext";
// import { store } from "./src/store";

// import { ThemeModeProvider, useThemeMode } from "./src/context/ThemeModeContext";
// import AppStatusBar from "./src/components/AppStatusBar";

// const linking = {
//   prefixes: ["oneorganize://", "https://one-organize-2.netlify.app", Linking.createURL("/")],
//   config: {
//     screens: {
//       ResetPassword: "reset-password",
//     },
//   },
// };

// function AppShell() {
//   const { paperTheme, navTheme } = useThemeMode();

//   return (
//     <PaperProvider theme={paperTheme}>
//       <AuthProvider>
//         <AppDataProvider>
//           <NavigationContainer linking={linking} theme={navTheme}>
//             <AppStatusBar />
//             <RootNavigator />
//           </NavigationContainer>
//         </AppDataProvider>
//       </AuthProvider>
//     </PaperProvider>
//   );
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <ThemeModeProvider>
//         <AppShell />
//       </ThemeModeProvider>
//     </Provider>
//   );
// }

import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import * as Linking from "expo-linking";
import { SafeAreaProvider } from "react-native-safe-area-context"; 

import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { AppDataProvider } from "./src/context/AppDataContext";
import { store } from "./src/store";
import Toast from 'react-native-toast-message';
// import { registerTranslation, enGB } from "react-native-paper-dates";


import { ThemeModeProvider, useThemeMode } from "./src/context/ThemeModeContext";
import AppStatusBar from "./src/components/AppStatusBar";

const linking = {
  prefixes: ["oneorganize://", "https://one-organize-2.netlify.app", Linking.createURL("/")],
  config: { screens: { ResetPassword: "reset-password" } },
};

function AppShell() {
  const { paperTheme, navTheme } = useThemeMode();

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <AppDataProvider>
          <NavigationContainer linking={linking} theme={navTheme}>
            <AppStatusBar />
            <RootNavigator />
          </NavigationContainer>
           <Toast/>

        </AppDataProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {

  // registerTranslation("enGB", enGB);

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
