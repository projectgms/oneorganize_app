import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Card,
  HelperText,
  IconButton,
  Text,
  TextInput,
  Snackbar,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  changePasswordRequest,
  resetChangePasswordState,
} from "./../../store/slices/authSlice";

export default function ChangePasswordScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { loading, error, changePasswordDone } = useSelector((s) => s.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  // show redux error (only when change password fails)
  useEffect(() => {
    if (error) setErr(error);
  }, [error]);

  // ✅ on success: clear + goBack
  useEffect(() => {
    if (!changePasswordDone) return;

    setOk(true);

    // clear fields
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
    setErr("");

    // reset redux flag so it won't auto-trigger next time
    dispatch(resetChangePasswordState());

    // go back to previous screen
    navigation?.goBack?.();
  }, [changePasswordDone, dispatch, navigation]);

  // ✅ when screen opens, ensure clean state
  useEffect(() => {
    const unsub = navigation?.addListener?.("focus", () => {
      setErr("");
      setOk(false);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      dispatch(resetChangePasswordState());
    });

    return unsub;
  }, [dispatch, navigation]);

  const onSubmit = () => {
    setErr("");

    if (!oldPassword || !newPassword || !confirm)
      return setErr("All fields are required");
    if (newPassword.length < 6)
      return setErr("New password must be at least 6 characters");
    if (newPassword !== confirm) return setErr("Passwords do not match");

    dispatch(
      changePasswordRequest({
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirm, // ✅ correct
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
          iconColor={theme.colors.onSurface}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Change Password
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
        <Card.Content>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Old Password<Text style={{ color: "#22c55e" }}> *</Text>
          </Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            mode="flat"
            placeholder="Enter old password"
            placeholderTextColor={theme.colors.onSurface}
            secureTextEntry={!showOld}
            style={[styles.input, { color: theme.colors.onSurface }]}
            underlineColor="#e5e7eb"
            activeUnderlineColor={theme.colors.onSurface}
            right={
              <TextInput.Icon
                icon={showOld ? "eye-off" : "eye"}
                onPress={() => setShowOld((s) => !s)}
                color={theme.colors.onSurface}
              />
            }
          />

          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            New Password<Text style={{ color: "#22c55e" }}> *</Text>
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            mode="flat"
            placeholder="Enter new password"
            placeholderTextColor={theme.colors.onSurface}
            secureTextEntry={!showNew}
            style={[styles.input, { color: theme.colors.onSurface }]}
            underlineColor="#e5e7eb"
            activeUnderlineColor={theme.colors.onSurface}
            right={
              <TextInput.Icon
                icon={showNew ? "eye-off" : "eye"}
                onPress={() => setShowNew((s) => !s)}
                color={theme.colors.onSurface}
              />
            }
          />

          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Confirm Password<Text style={{ color: "#22c55e" }}> *</Text>
          </Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            mode="flat"
            placeholder="Re-enter new password"
            placeholderTextColor={theme.colors.onSurface}
            secureTextEntry={!showConfirm}
            style={[styles.input, { color: theme.colors.onSurface }]}
            underlineColor="#e5e7eb"
            activeUnderlineColor={theme.colors.onSurface}
            right={
              <TextInput.Icon
                icon={showConfirm ? "eye-off" : "eye"}
                onPress={() => setShowConfirm((s) => !s)}
                color={theme.colors.onSurface}
              />
            }
          />

          <HelperText type="error" visible={!!err} style={{ marginTop: 6 }}>
            {err}
          </HelperText>

          <View style={{ height: 10 }} />

          <Button
            mode="contained"
            onPress={onSubmit}
            loading={loading}
            disabled={loading}
            contentStyle={{ height: 54 }}
            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
            labelStyle={{
              fontSize: 16,
              fontWeight: "700",
              color: theme.colors.onPrimary,
            }}
          >
            Update Password
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={ok} onDismiss={() => setOk(false)} duration={1200}>
        Password updated
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },

  card: { margin: 16, borderRadius: 14, elevation: 0 },

  label: { marginTop: 10, fontSize: 12, opacity: 0.65 },

  input: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },

  saveBtn: { borderRadius: 14, marginTop: 18, borderWidth: 1 },
});
