import React, { useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Snackbar, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async () => {
    setErr("");
    if (!oldPassword || !newPassword) return setErr("All fields are required");
    if (newPassword !== confirm) return setErr("Passwords do not match");

    setLoading(true);
    const res = await changePassword({ oldPassword, newPassword });
    setLoading(false);

    if (!res.ok) return setErr(res.message || "Change failed");
    setOk(true);
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Card>
        <Card.Title title="Change Password" subtitle="Dummy check: old password = 123456" />
        <Card.Content>
          <TextInput label="Old Password" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
          <View style={{ height: 12 }} />
          <TextInput label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          <View style={{ height: 12 }} />
          <TextInput label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry />

          <HelperText type="error" visible={!!err}>{err}</HelperText>

          <Button mode="contained" onPress={onSubmit} loading={loading}>
            Update Password
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={ok} onDismiss={() => setOk(false)} duration={2000}>
        Password updated (dummy success)
      </Snackbar>
    </View>
  );
}
