import React from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card>
        <Card.Title title="Profile" subtitle="Dummy user profile" />
        <Card.Content>
          <Text>Name: {user?.name}</Text>
          <Text>Email: {user?.email}</Text>

          <View style={{ height: 12 }} />
          <Button mode="outlined" onPress={() => navigation.navigate("ChangePasswordDrawer")}>
            Change Password
          </Button>

          <View style={{ height: 8 }} />
          <Button mode="contained" onPress={logout}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
