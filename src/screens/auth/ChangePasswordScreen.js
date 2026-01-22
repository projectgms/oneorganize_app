import React, { useState } from "react";
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
import { useAuth } from "../../context/AuthContext";

import { changePasswordRequest } from "./../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async () => {
    setErr("");

    if (!oldPassword || !newPassword || !confirm)
      return setErr("All fields are required");
    if (newPassword.length < 6)
      return setErr("New password must be at least 6 characters");
    if (newPassword !== confirm) return setErr("Passwords do not match");

    try {
      // setLoading(true);
      // const res = await changePassword({ oldPassword, newPassword });

      dispatch(
        changePasswordRequest({
          password: newPassword,
          old_password: oldPassword,
          password_confirmation: newPassword,
        }),
      );

      if (!res?.ok) {
        setErr(res?.message || "Change failed");
        return;
      }

      setOk(true);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header (same as Edit Profile) */}
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
          {/* Old */}
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

          {/* New */}
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

          {/* Confirm */}
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

          {/* Button style same as Edit Profile */}
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

      <Snackbar visible={ok} onDismiss={() => setOk(false)} duration={2000}>
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
