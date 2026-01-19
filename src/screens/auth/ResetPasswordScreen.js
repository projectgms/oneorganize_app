import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, TextInput, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequest, clearResetPasswordState } from "../../store/slices/authSlice";

export default function ResetPasswordScreen({ navigation, route }) {
  const dispatch = useDispatch();

  const initialEmail = route?.params?.email ?? "";
  const token = route?.params?.token ?? "";      // hidden
  const tenant = route?.params?.tenant ?? "";    // hidden but important for X-Tenant

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetLoading, resetError, resetMessage } = useSelector((s) => s.auth);

  const localErr =
    !email || !password || !confirmpassword
      ? "All fields are required"
      : password !== confirmpassword
      ? "Passwords do not match"
      : !token
      ? "Reset token missing. Please open the reset link again from email."
      : "";

  const onSubmit = () => {
    if (localErr) return;

    dispatch(
      resetPasswordRequest({
        email,
        token, // ✅ not shown
        password,
        confirmPassword,
        tenant, // ✅ ensures X-Tenant is set in saga/interceptor before API call
      })
    );
  };

  useEffect(() => {
    if (resetMessage) {
      navigation.popToTop();
      dispatch(clearResetPasswordState());
    }
  }, [resetMessage, navigation, dispatch]);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Card>
        <Card.Title title="Reset Password" subtitle="Set a new password" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ height: 12 }} />
          <TextInput
            label="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={{ height: 12 }} />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <HelperText type="error" visible={!!localErr || !!resetError}>
            {resetError || localErr}
          </HelperText>

          {!!resetMessage && <Text style={{ marginBottom: 8, opacity: 0.8 }}>{resetMessage}</Text>}

          <Button mode="contained" onPress={onSubmit} loading={resetLoading} disabled={resetLoading || !!localErr}>
            Reset Password
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}