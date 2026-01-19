import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, TextInput, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, clearAuthError } from "../../store/slices/authSlice";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("abhisaloke224@gmail.com");
  const [password, setPassword] = useState("Pass@8087");

  useEffect(() => {
    // navigate after login
    if (token) navigation.replace("Dashboard"); // adjust route name
  }, [token]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = () => {
    dispatch(
      loginRequest({
        email,
        password,
        tenant: process.env.EXPO_PUBLIC_TENANT, // matches Postman X-Tenant
      })
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Card>
        <Card.Title title="Welcome Back" subtitle="Login to continue" />
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
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button mode="contained" onPress={onSubmit} loading={loading} style={{ marginTop: 8 }}>
            Login
          </Button>

          <View style={{ height: 12 }} />
          <Button onPress={() => navigation.navigate("ForgotPassword")}>Forgot Password?</Button>
        </Card.Content>
      </Card>
    </View>
  );
}
