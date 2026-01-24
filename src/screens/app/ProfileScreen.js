// import React, { useMemo, useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform,
// } from "react-native";
// import {
//   Card,
//   Text,
//   TextInput,
//   Button,
//   IconButton,
//   useTheme,
// } from "react-native-paper";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library"; // ✅ iOS ph:// fix
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProfileReq, getProfileReq } from "./../../store/slices/ProfileSlice";
// import Toast from "react-native-toast-message";
// import { useFocusEffect } from "@react-navigation/native";
// import { EditProfileSkeleton } from "./components/ProfileScreen/EditProfileSkeleton";

// const FALLBACK_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=0B6B74&color=fff&size=256";

// export default function EditProfileScreen({ navigation }) {
//   const dispatch = useDispatch();
//   const theme = useTheme();

//   const profileData = useSelector((s) => s.profile.data);
//   const profileDataLoading = useSelector((s) => s.profile.profileLoading);
//   const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
//   const user = useSelector((s) => s.auth.user);

//   const [name, setName] = useState(profileData?.name || "");
//   const [photoUri, setPhotoUri] = useState(profileData?.profile_picture || "");
//   const [pickedImage, setPickedImage] = useState(null); // { uri, name, type }
//   const [saving, setSaving] = useState(false);

//   // ✅ Keep local state in sync after profile loads/refreshes
//   useEffect(() => {
//     if (profileData?.name) setName(profileData.name);
//     if (profileData?.profile_picture) setPhotoUri(profileData.profile_picture);
//   }, [profileData?.name, profileData?.profile_picture]);

//   useFocusEffect(
//     useCallback(() => {
//       dispatch(getProfileReq());
//     }, [dispatch])
//   );

//   const previewUri = useMemo(() => {
//     // prefer newly picked image, else server image, else fallback
//     return pickedImage?.uri || photoUri || FALLBACK_AVATAR;
//   }, [pickedImage, photoUri]);

//   const pickImage = useCallback(async () => {
//     try {
//       const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (perm.status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "Please allow photo library access to change your profile picture."
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (result.canceled) return;

//       const asset = result.assets?.[0];
//       if (!asset?.uri) return;

//       let uri = asset.uri;

//       // ✅ iOS: convert ph:// uri to a real local file uri
//       if (Platform.OS === "ios" && uri.startsWith("ph://")) {
//         // asset.assetId exists on newer expo versions
//         if (asset.assetId) {
//           const info = await MediaLibrary.getAssetInfoAsync(asset.assetId);
//           if (info?.localUri) uri = info.localUri; // file://...
//         }
//       }

//       const fileName = asset.fileName || `profile_${Date.now()}.jpg`;
//       const ext = (fileName.split(".").pop() || "jpg").toLowerCase();
//       const type =
//         ext === "png"
//           ? "image/png"
//           : ext === "webp"
//           ? "image/webp"
//           : "image/jpeg";

//       setPickedImage({ uri, name: fileName, type });
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Could not pick image.");
//     }
//   }, []);

//   const onSave = useCallback(async () => {
//     if (!name.trim()) {
//       Alert.alert("Validation", "Name cannot be empty.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const form = new FormData();
//       form.append("name", name.trim());
//       form.append("id", String(user?.id || ""));

//       if (pickedImage?.uri) {
//         form.append("profile_picture", {
//           uri: pickedImage.uri,
//           name: pickedImage.name || "profile.jpg",
//           type: pickedImage.type || "image/jpeg",
//         });
//       }

//       dispatch(updateProfileReq(form));

//       // ⚠️ Don’t show success toast here (dispatch is async via saga)
//       // Show it on updateProfileSucc (recommended).
//       // Keeping a lightweight message is okay if you want:
//       Toast.show({ text1: "Saving..." });
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Update failed.");
//     } finally {
//       setSaving(false);
//     }
//   }, [name, user?.id, pickedImage, dispatch]);

//   const primary = theme.colors.primary;
//   const onPrimary = theme.colors.onPrimary;
//   const onSurface = theme.colors.onSurface;
//   const outline = theme.colors.outline || onSurface;

//   if (getProfileLoading) return <EditProfileSkeleton />;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <IconButton icon="chevron-left" size={28} onPress={() => navigation?.goBack?.()} />
//         <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
//           Edit Profile
//         </Text>
//         <View style={{ width: 44 }} />
//       </View>

//       <Card style={styles.card}>
//         <Card.Content>
//           {/* Avatar */}
//           <View style={styles.avatarWrap}>
//             <TouchableOpacity activeOpacity={0.85} onPress={pickImage} style={styles.avatarRing}>
//               <Image
//                 source={{ uri: previewUri }}
//                 style={styles.avatar}
//                 onError={() => {
//                   // if server image broken, fall back
//                   if (photoUri) setPhotoUri("");
//                 }}
//               />
//               <View style={styles.editBadge}>
//                 <MaterialCommunityIcons size={15} name="pencil-outline" color={"#fff"} />
//               </View>
//             </TouchableOpacity>

//             <Text style={styles.hint}>Tap photo to change</Text>
//           </View>

//           {/* Name */}
//           <Text style={styles.label}>
//             Name<Text style={{ color: "#22c55e" }}> *</Text>
//           </Text>

//           <TextInput
//             value={name}
//             onChangeText={setName}
//             mode="flat"
//             placeholder="Enter your name"
//             style={styles.input}
//             underlineColor="#e5e7eb"
//             activeUnderlineColor={primary}
//           />

//           <View style={{ height: 18 }} />

//           <Button
//             mode="contained"
//             onPress={onSave}
//             loading={profileDataLoading}
//             disabled={saving || profileDataLoading}
//             contentStyle={{ height: 54 }}
//             style={[styles.saveBtn, { backgroundColor: primary }]}
//             labelStyle={{ fontSize: 16, fontWeight: "700", color: onPrimary }}
//           >
//             Save
//           </Button>

//           <Button
//             mode="outlined"
//             onPress={() => navigation?.navigate?.("ChangePasswordDrawer")}
//             contentStyle={{ height: 54 }}
//             style={{
//               borderRadius: 14,
//               borderColor: outline,
//               borderWidth: 2,
//               marginVertical: 12,
//               backgroundColor: "transparent",
//             }}
//             labelStyle={{ fontSize: 16, fontWeight: "700", color: onSurface }}
//           >
//             Change Password
//           </Button>
//         </Card.Content>
//       </Card>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 6,
//     paddingHorizontal: 4,
//   },
//   headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },

//   card: { margin: 16, borderRadius: 14, elevation: 0 },

//   avatarWrap: { alignItems: "center", marginTop: 6, marginBottom: 10 },
//   avatarRing: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: "#f1f5f9",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   avatar: { width: 96, height: 96, borderRadius: 48 },

//   editBadge: {
//     position: "absolute",
//     right: 6,
//     bottom: 6,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 2,
//   },

//   hint: { marginTop: 8, fontSize: 12, opacity: 0.6 },

//   label: { marginTop: 10, fontSize: 12, opacity: 0.65 },

//   input: { backgroundColor: "transparent", paddingHorizontal: 0 },

//   saveBtn: { borderRadius: 14 },
// });

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { Card, Text, TextInput, Button, IconButton, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system"; // ✅ ANDROID content:// fix
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileReq, getProfileReq } from "./../../store/slices/ProfileSlice";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { EditProfileSkeleton } from "./components/ProfileScreen/EditProfileSkeleton";

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0B6B74&color=fff&size=256";

async function ensureFileUri(uri, fileName = `profile_${Date.now()}.jpg`) {
  // If already file://, keep it
  if (uri?.startsWith("file://")) return uri;

  // Android often gives content:// -> copy to cache so FormData can read it
  if (Platform.OS === "android" && uri?.startsWith("content://")) {
    const dest = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest; // file://...
  }

  // iOS ph:// handled separately via MediaLibrary
  return uri;
}

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const profileData = useSelector((s) => s.profile.data);
  const profileDataLoading = useSelector((s) => s.profile.profileLoading);
  const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
  const user = useSelector((s) => s.auth.user);

  const [name, setName] = useState(profileData?.name || "");
  const [photoUri, setPhotoUri] = useState(profileData?.profile_picture || "");
  const [pickedImage, setPickedImage] = useState(null); // { uri, name, type }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profileData?.name || "");
    setPhotoUri(profileData?.profile_picture || "");
  }, [profileData?.name, profileData?.profile_picture]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getProfileReq());
    }, [dispatch])
  );

  const previewUri = useMemo(() => {
    return pickedImage?.uri || photoUri || FALLBACK_AVATAR;
  }, [pickedImage, photoUri]);

  const pickImage = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission required", "Please allow photo library access to change your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      let uri = asset.uri;

      // ✅ iOS ph:// -> file://
      if (Platform.OS === "ios" && uri.startsWith("ph://")) {
        if (asset.assetId) {
          const info = await MediaLibrary.getAssetInfoAsync(asset.assetId);
          if (info?.localUri) uri = info.localUri;
        }
      }

      const fileName = asset.fileName || `profile_${Date.now()}.jpg`;
      uri = await ensureFileUri(uri, fileName); // ✅ ANDROID FIX

      const mime = asset.mimeType || "";
      const ext = (fileName.split(".").pop() || "jpg").toLowerCase();
      const type =
        mime ||
        (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg");

      setPickedImage({ uri, name: fileName, type });
    } catch (e) {
      Alert.alert("Error", e?.message || "Could not pick image.");
    }
  }, [dispatch]);

  const onSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const form = new FormData();
      form.append("name", name.trim());
      form.append("id", String(user?.id || ""));

      if (pickedImage?.uri) {
        form.append("profile_picture", {
          uri: pickedImage.uri,
          name: pickedImage.name || "profile.jpg",
          type: pickedImage.type || "image/jpeg",
        });
      }

      dispatch(updateProfileReq(form));
      Toast.show({ type: "info", text1: "Uploading..." });
    } catch (e) {
      Alert.alert("Error", e?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  }, [name, user?.id, pickedImage, dispatch]);

  const primary = theme.colors.primary;
  const onPrimary = theme.colors.onPrimary;
  const onSurface = theme.colors.onSurface;
  const outline = theme.colors.outline || onSurface;

  if (getProfileLoading) return <EditProfileSkeleton />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" size={28} onPress={() => navigation?.goBack?.()} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarWrap}>
            <TouchableOpacity activeOpacity={0.85} onPress={pickImage} style={styles.avatarRing}>
              <Image
                key={previewUri} // ✅ forces re-render
                source={{ uri: previewUri }}
                style={styles.avatar}
                onError={() => {
                  if (photoUri) setPhotoUri("");
                }}
              />
              <View style={styles.editBadge}>
                <MaterialCommunityIcons size={15} name="pencil-outline" color={"#fff"} />
              </View>
            </TouchableOpacity>
            <Text style={styles.hint}>Tap photo to change</Text>
          </View>

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
            activeUnderlineColor={primary}
          />

          <View style={{ height: 18 }} />

          <Button
            mode="contained"
            onPress={onSave}
            loading={profileDataLoading}
            disabled={saving || profileDataLoading}
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
  header: { flexDirection: "row", alignItems: "center", paddingTop: 6, paddingHorizontal: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },
  card: { margin: 16, borderRadius: 14, elevation: 0 },
  avatarWrap: { alignItems: "center", marginTop: 6, marginBottom: 10 },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  editBadge: {
    position: "absolute", right: 6, bottom: 6,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#000", alignItems: "center", justifyContent: "center", elevation: 2,
  },
  hint: { marginTop: 8, fontSize: 12, opacity: 0.6 },
  label: { marginTop: 10, fontSize: 12, opacity: 0.65 },
  input: { backgroundColor: "transparent", paddingHorizontal: 0 },
  saveBtn: { borderRadius: 14 },
});
