import React, { useMemo, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  Card,
  Text,
  TextInput,
  Button,
  IconButton,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileReq } from "./../../store/slices/ProfileSlice";
import Toast from "react-native-toast-message";

export default function EditProfileScreen({ navigation }) {
  const profileData = useSelector((s) => s.profile.data);

  const profileDataLoading = useSelector((s) => s.profile.profileLoading);

  const [name, setName] = useState(profileData?.name || "Name");
  const [photoUri, setPhotoUri] = useState(profileData?.profile_picture);
  const [pickedImage, setPickedImage] = useState(null); // { uri, name, type }
  const [saving, setSaving] = useState(false);
  const user = useSelector((s) => s.auth.user);

  const dispatch = useDispatch();

  const theme = useTheme();

  const previewUri = useMemo(
    () => pickedImage?.uri || photoUri,
    [pickedImage, photoUri],
  );

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const uri = asset.uri;
    const name = asset.fileName || `profile_${Date.now()}.jpg`; // safe fallback

    // best effort mime type
    const ext = (name.split(".").pop() || "jpg").toLowerCase();
    const type =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";

    setPickedImage({ uri, name, type });
  };

  const onSave = async () => {
    if (!name.trim()) return Alert.alert("Validation", "Name cannot be empty.");

    try {
      setSaving(true);

      // If you need to dispatch/API call, do it here.
      // Example multipart payload:
      const form = new FormData();
      form.append("name", name.trim());
      form.append("id", user?.id);
      if (pickedImage?.uri) {
        form.append("profile_picture", {
          uri: pickedImage.uri,
          name: pickedImage.name || "profile.jpg",
          type: pickedImage.type || "image/jpeg",
        });
      }

      // console.log("pickedImage", pickedImage);

      // await api.put("/me", form, { headers: { "Content-Type": "multipart/form-data" } });
      // or dispatch(updateProfile({ name: name.trim(), image: pickedImage }))

      dispatch(updateProfileReq(form));
      Toast.show({
        text1: "Profile Updated Successfully",
      });

      // Alert.alert("Success", "Profile updated!");
      // navigation?.goBack?.();
    } catch (e) {
      Alert.alert("Error", e?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  // const primary = "#0B6B74";

  const primary = theme.colors.primary; // your theme main color
  const onPrimary = theme.colors.onPrimary; // text color on primary
  const surface = theme.colors.surface; // card/button bg
  const onSurface = theme.colors.onSurface;
  const outline = theme.colors.outline || onSurface;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigation?.goBack?.()}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Edit Profile
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickImage}
              style={styles.avatarRing}
            >
              <Image source={{ uri: previewUri }} style={styles.avatar} />
              <View style={styles.editBadge}>
                <MaterialCommunityIcons
                  size={15}
                  name="pencil-outline"
                  color={"#fff"}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.hint}>Tap photo to change</Text>
          </View>

          {/* Name only */}
          <Text style={styles.label}>
            Name<Text style={{ color: "#22c55e" }}> *</Text>
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            mode="flat"
            placeholder="Enter your name"
            style={styles.input}
            underlineColor="#e5e7eb"
            activeUnderlineColor="#0B6B74"
          />

          <View style={{ height: 18 }} />

          <Button
            mode="contained"
            onPress={onSave}
            loading={profileDataLoading}
            disabled={saving}
            contentStyle={{ height: 54 }}
            style={[styles.saveBtn, { backgroundColor: primary }]}
            labelStyle={{ fontSize: 16, fontWeight: "700", color: onPrimary }}
          >
            Save
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation?.navigate?.("ChangePasswordDrawer")}
            contentStyle={{ height: 54 }}
            style={{
              borderRadius: 14,
              borderColor: outline,
              borderWidth: 2,
              marginVertical: 12,
              backgroundColor: "transparent",
            }}
            labelStyle={{ fontSize: 16, fontWeight: "700", color: onSurface }}
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>
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

  avatarWrap: { alignItems: "center", marginTop: 6, marginBottom: 10 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: { width: 96, height: 96, borderRadius: 48 },

  editBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  hint: { marginTop: 8, fontSize: 12, opacity: 0.6 },

  label: { marginTop: 10, fontSize: 12, opacity: 0.65 },

  input: { backgroundColor: "transparent", paddingHorizontal: 0 },

  saveBtn: { borderRadius: 14 },
});
