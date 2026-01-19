import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";
import { useSelector } from "react-redux";

export default function RootNavigator() {
  // const { token } = useAuth();
  const token = useSelector((s) => s.auth.token);
  return token ? <AppDrawer /> : <AuthStack />;
}
