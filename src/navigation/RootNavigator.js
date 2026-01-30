import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { hydrateAuthRequest } from "../store/slices/authSlice";

import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";

export default function RootNavigator() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const token = useSelector((s) => s.auth.token);
  const bootstrapping = useSelector((s) => s.auth.bootstrapping);

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    dispatch(hydrateAuthRequest()); // ✅ checks token from storage
  }, [dispatch]);

  if (bootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator />
      </View>
    );
  }

  return token ? <AppDrawer /> : <AuthStack />;
}
