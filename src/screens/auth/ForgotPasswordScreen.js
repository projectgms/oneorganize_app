import React, { useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, TextInput, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordRequest, clearForgotPasswordState } from "../../store/slices/authSlice";

export default function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { forgotLoading, forgotError, forgotMessage } = useSelector((s) => s.auth);

  const onSubmit = () => {
    if (!email) return;

    dispatch(
      forgotPasswordRequest({
        email,
        // tenant: "tico" // optional
      })
    );
  };

  const onBackToLogin = () => {
    dispatch(clearForgotPasswordState());
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Card>
        <Card.Title title="Forgot Password" subtitle="We’ll send a reset link to your email" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <HelperText type="error" visible={!!forgotError}>
            {forgotError}
          </HelperText>

          {!!forgotMessage && (
            <Text style={{ marginVertical: 10, opacity: 0.8 }}>
              {forgotMessage}{"\n"}Please check your email and open the reset link.
            </Text>
          )}

          <Button
            mode="contained"
            onPress={onSubmit}
            loading={forgotLoading}
            disabled={forgotLoading}
          >
            Send Reset Link
          </Button>

          <Button
            style={{ marginTop: 10 }}
            mode="text"
            onPress={onBackToLogin}
          >
            Back to Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
