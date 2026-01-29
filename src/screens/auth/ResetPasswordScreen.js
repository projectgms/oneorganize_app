// import React, { useEffect, useState } from "react";
// import { View } from "react-native";
// import { Button, Card, HelperText, TextInput, Text } from "react-native-paper";
// import { useDispatch, useSelector } from "react-redux";
// import { resetPasswordRequest, clearResetPasswordState } from "../../store/slices/authSlice";

// export default function ResetPasswordScreen({ navigation, route }) {
//   const dispatch = useDispatch();

//   const initialEmail = route?.params?.email ?? "";
//   const token = route?.params?.token ?? "";      // hidden
//   const tenant = route?.params?.tenant ?? "";    // hidden but important for X-Tenant

//   const [email, setEmail] = useState(initialEmail);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const { resetLoading, resetError, resetMessage } = useSelector((s) => s.auth);

//   const localErr =
//     !email || !password || !confirmpassword
//       ? "All fields are required"
//       : password !== confirmpassword
//       ? "Passwords do not match"
//       : !token
//       ? "Reset token missing. Please open the reset link again from email."
//       : "";

//   const onSubmit = () => {
//     if (localErr) return;

//     dispatch(
//       resetPasswordRequest({
//         email,
//         token, // ✅ not shown
//         password,
//         confirmPassword,
//         tenant, // ✅ ensures X-Tenant is set in saga/interceptor before API call
//       })
//     );
//   };

//   useEffect(() => {
//     if (resetMessage) {
//       navigation.popToTop();
//       dispatch(clearResetPasswordState());
//     }
//   }, [resetMessage, navigation, dispatch]);

//   return (
//     <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
//       <Card>
//         <Card.Title title="Reset Password" subtitle="Set a new password" />
//         <Card.Content>
//           <TextInput
//             label="Email"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />
//           <View style={{ height: 12 }} />
//           <TextInput
//             label="New Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//           <View style={{ height: 12 }} />
//           <TextInput
//             label="Confirm Password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry
//           />

//           <HelperText type="error" visible={!!localErr || !!resetError}>
//             {resetError || localErr}
//           </HelperText>

//           {!!resetMessage && <Text style={{ marginBottom: 8, opacity: 0.8 }}>{resetMessage}</Text>}

//           <Button mode="contained" onPress={onSubmit} loading={resetLoading} disabled={resetLoading || !!localErr}>
//             Reset Password
//           </Button>
//         </Card.Content>
//       </Card>
//     </View>
//   );
// }

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Easing,
//   InteractionManager,
// } from "react-native";
// import { Button, HelperText, TextInput, Text, Card } from "react-native-paper";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   resetPasswordRequest,
//   clearResetPasswordState,
// } from "../../store/slices/authSlice";
// import { useFocusEffect } from "@react-navigation/native";

// export default function ResetPasswordScreen({ navigation, route }) {
//   const dispatch = useDispatch();

//   const initialEmail = route?.params?.email ?? "";
//   const token = route?.params?.token ?? ""; // hidden
//   const tenant = route?.params?.tenant ?? ""; // hidden but important for X-Tenant

//   const [email, setEmail] = useState(initialEmail);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const { resetLoading, resetError, resetMessage } = useSelector((s) => s.auth);

//   const COLORS = useMemo(
//     () => ({
//       screenBg: "#EEF2F6",
//       brandBlue: "#2F80ED",
//       cardBg: "#FFFFFF",
//       titleText: "#0F172A",
//       label: "#111827",
//       muted: "#9AA6B2",
//       inputBg: "#EEF2F6",
//       link: "#2F80ED",
//       btnBlue: "#2F80ED",
//     }),
//     []
//   );

//   const localErr = useMemo(() => {
//     if (!email?.trim() || !password || !confirmPassword) return "All fields are required";
//     if (password !== confirmPassword) return "Passwords do not match";
//     if (!token) return "Reset token missing. Please open the reset link again from email.";
//     return "";
//   }, [email, password, confirmPassword, token]);

//   // ✅ Slide animation values (same as Login)
//   const translateY = useRef(new Animated.Value(260)).current;
//   const opacity = useRef(new Animated.Value(0)).current;

//   const runCardIntro = useCallback(() => {
//     translateY.setValue(260);
//     opacity.setValue(0);

//     Animated.parallel([
//       Animated.timing(translateY, {
//         toValue: 0,
//         duration: 550,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }),
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 450,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [opacity, translateY]);

//   useFocusEffect(
//     useCallback(() => {
//       const task = InteractionManager.runAfterInteractions(() => {
//         runCardIntro();
//       });
//       return () => task?.cancel?.();
//     }, [runCardIntro])
//   );

//   const onSubmit = () => {
//     if (localErr) return;

//     dispatch(
//       resetPasswordRequest({
//         email: email.trim(),
//         token,
//         password,
//         confirmPassword,
//         tenant, // ✅ keep this for X-Tenant
//       })
//     );
//   };

//   useEffect(() => {
//     if (resetMessage) {
//       navigation.popToTop();
//       dispatch(clearResetPasswordState());
//     }
//   }, [resetMessage, navigation, dispatch]);

//   useEffect(() => {
//     return () => dispatch(clearResetPasswordState());
//   }, [dispatch]);

//   return (
//     <KeyboardAvoidingView
//       style={[styles.root, { backgroundColor: COLORS.screenBg }]}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       {/* ✅ TOP (flex:1) - Logo */}
//       <View style={styles.top}>
//         <Image
//           source={require("../../../assets/gms.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>

//       {/* ✅ BOTTOM (flex:1) - Card slides in */}
//       <View style={styles.bottom}>
//         <Animated.View style={[styles.cardAnimWrap, { transform: [{ translateY }], opacity }]}>
//           <Card style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
//             <Card.Content>
//               <Text style={[styles.welcome, { color: COLORS.titleText }]}>
//                 Reset Password{"\n"}Set a new password
//               </Text>

//               <Text style={[styles.sub, { color: COLORS.muted }]}>
//                 Create a strong password and confirm it to continue.
//               </Text>

//               {/* Email */}
//               <Text style={[styles.label, { color: COLORS.label }]}>Email</Text>
//               <TextInput
//                 mode="flat"
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="joedoe75@gmail.com"
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 underlineColor="transparent"
//                 activeUnderlineColor="transparent"
//                 style={[styles.input, { backgroundColor: COLORS.inputBg }]}
//                 contentStyle={styles.inputContent}
//                 placeholderTextColor={COLORS.muted}
//                 textColor={COLORS.titleText}
//                 left={<TextInput.Icon icon="email-outline" color={COLORS.muted} />}
//                 theme={{ roundness: 14 }}
//               />

//               {/* New Password */}
//               <Text style={[styles.label, { color: COLORS.label, marginTop: 12 }]}>
//                 New Password
//               </Text>
//               <TextInput
//                 mode="flat"
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="•••••••"
//                 secureTextEntry={!showPass}
//                 underlineColor="transparent"
//                 activeUnderlineColor="transparent"
//                 style={[styles.input, { backgroundColor: COLORS.inputBg }]}
//                 contentStyle={styles.inputContent}
//                 placeholderTextColor={COLORS.muted}
//                 textColor={COLORS.titleText}
//                 left={<TextInput.Icon icon="lock-outline" color={COLORS.muted} />}
//                 right={
//                   <TextInput.Icon
//                     icon={showPass ? "eye-off-outline" : "eye-outline"}
//                     color={COLORS.muted}
//                     onPress={() => setShowPass((v) => !v)}
//                   />
//                 }
//                 theme={{ roundness: 14 }}
//               />

//               {/* Confirm Password */}
//               <Text style={[styles.label, { color: COLORS.label, marginTop: 12 }]}>
//                 Confirm Password
//               </Text>
//               <TextInput
//                 mode="flat"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 placeholder="•••••••"
//                 secureTextEntry={!showConfirm}
//                 underlineColor="transparent"
//                 activeUnderlineColor="transparent"
//                 style={[styles.input, { backgroundColor: COLORS.inputBg }]}
//                 contentStyle={styles.inputContent}
//                 placeholderTextColor={COLORS.muted}
//                 textColor={COLORS.titleText}
//                 left={<TextInput.Icon icon="lock-check-outline" color={COLORS.muted} />}
//                 right={
//                   <TextInput.Icon
//                     icon={showConfirm ? "eye-off-outline" : "eye-outline"}
//                     color={COLORS.muted}
//                     onPress={() => setShowConfirm((v) => !v)}
//                   />
//                 }
//                 theme={{ roundness: 14 }}
//               />

//               <HelperText type="error" visible={!!localErr || !!resetError} style={{ marginTop: 6 }}>
//                 {resetError || localErr}
//               </HelperText>

//               {!!resetMessage && (
//                 <View style={styles.successBox}>
//                   <Text style={[styles.successText, { color: COLORS.titleText }]}>
//                     {resetMessage}
//                   </Text>
//                 </View>
//               )}

//               {/* Reset Button */}
//               <Button
//                 mode="contained"
//                 onPress={onSubmit}
//                 loading={resetLoading}
//                 disabled={resetLoading || !!localErr}
//                 buttonColor={COLORS.btnBlue}
//                 textColor="#fff"
//                 style={styles.loginBtn}
//                 contentStyle={styles.loginBtnContent}
//                 labelStyle={styles.loginBtnLabel}
//               >
//                 Reset Password
//               </Button>

//               {/* Back */}
//               <TouchableOpacity onPress={() => navigation.popToTop()}>
//                 <Text style={[styles.forgot, { color: COLORS.link }]}>Back to Login</Text>
//               </TouchableOpacity>
//             </Card.Content>
//           </Card>
//         </Animated.View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1 },

//   top: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: Platform.OS === "android" ? 14 : 32,
//   },

//   logo: {
//     width: 180,
//     height: 60,
//   },

//   bottom: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },

//   cardAnimWrap: {
//     width: "100%",
//   },

//   card: {
//     width: "100%",
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     overflow: "hidden",
//     elevation: 4,
//   },

//   welcome: {
//     fontSize: 18,
//     fontWeight: "800",
//     textAlign: "center",
//     marginBottom: 6,
//     lineHeight: 24,
//   },

//   sub: {
//     textAlign: "center",
//     fontSize: 12,
//     fontWeight: "600",
//     marginBottom: 16,
//   },

//   label: {
//     fontSize: 12,
//     fontWeight: "700",
//     marginBottom: 6,
//     marginLeft: 4,
//   },

//   input: {
//     height: 44,
//     borderRadius: 14,
//     overflow: "hidden",
//   },

//   inputContent: {
//     height: 44,
//   },

//   successBox: {
//     marginTop: 10,
//     padding: 10,
//     borderRadius: 12,
//     backgroundColor: "rgba(47,128,237,0.08)",
//   },

//   successText: {
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   loginBtn: {
//     marginTop: 14,
//     borderRadius: 18,
//   },

//   loginBtnContent: {
//     height: 46,
//   },

//   loginBtnLabel: {
//     fontSize: 14,
//     fontWeight: "800",
//   },

//   forgot: {
//     marginTop: 12,
//     alignSelf: "center",
//     fontSize: 12,
//     fontWeight: "800",
//     textDecorationLine: "underline",
//   },
// });

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  InteractionManager,
} from "react-native";
import { Button, HelperText, TextInput, Text, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequest, clearResetPasswordState } from "../../store/slices/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeModeContext"; // ✅ adjust path

export default function ResetPasswordScreen({ navigation, route }) {
  const dispatch = useDispatch();

  const initialEmail = route?.params?.email ?? "";
  const token = route?.params?.token ?? ""; // hidden
  const tenant = route?.params?.tenant ?? ""; // hidden but important for X-Tenant

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetLoading, resetError, resetMessage } = useSelector((s) => s.auth);

  // ✅ theme
  const { paperTheme } = useThemeMode();

  // ✅ theme-aware UI colors
  const COLORS = useMemo(() => {
    const c = paperTheme.colors;
    const isDark = !!paperTheme.dark;

    const cardBg = isDark ? (c.elevation?.level2 ?? c.surface) : c.surface;
    const inputBg = isDark ? (c.elevation?.level1 ?? c.surfaceVariant) : c.surfaceVariant;

    return {
      screenBg: c.background,
      brandBlue: c.primary,

      cardBg,
      cardBorder: isDark ? (c.outlineVariant ?? c.outline) : "transparent",

      titleText: c.onSurface,
      label: c.onSurface,
      muted: c.onSurfaceVariant,

      inputBg,
      link: c.primary,
      btnBlue: c.primary,

      successBg: isDark ? (c.elevation?.level1 ?? c.surfaceVariant) : "rgba(47,128,237,0.08)",
      isDark,
    };
  }, [paperTheme]);

  const localErr = useMemo(() => {
    if (!email?.trim() || !password || !confirmPassword) return "All fields are required";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!token) return "Reset token missing. Please open the reset link again from email.";
    return "";
  }, [email, password, confirmPassword, token]);

  // ✅ Slide animation
  const translateY = useRef(new Animated.Value(260)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const runCardIntro = useCallback(() => {
    translateY.setValue(260);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(runCardIntro);
      return () => task?.cancel?.();
    }, [runCardIntro])
  );

  const onSubmit = () => {
    if (localErr) return;

    dispatch(
      resetPasswordRequest({
        email: email.trim(),
        token,
        password,
        confirmPassword,
        tenant, // ✅ keep this for X-Tenant
      })
    );
  };

  useEffect(() => {
    if (resetMessage) {
      navigation.popToTop();
      dispatch(clearResetPasswordState());
    }
  }, [resetMessage, navigation, dispatch]);

  useEffect(() => {
    return () => dispatch(clearResetPasswordState());
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: COLORS.screenBg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* TOP (flex:1) - Logo */}
      <View style={styles.top}>
        <Image
          source={require("../../../assets/gms.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* BOTTOM (flex:1) - Card slides in */}
      <View style={styles.bottom}>
        <Animated.View style={[styles.cardAnimWrap, { transform: [{ translateY }], opacity }]}>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: COLORS.cardBg,
                borderTopWidth: COLORS.isDark ? 1 : 0,
                borderLeftWidth: COLORS.isDark ? 1 : 0,
                borderRightWidth: COLORS.isDark ? 1 : 0,
                borderColor: COLORS.cardBorder,
              },
            ]}
          >
            <Card.Content>
              <Text style={[styles.welcome, { color: COLORS.titleText }]}>
                Reset Password{"\n"}Set a new password
              </Text>

              <Text style={[styles.sub, { color: COLORS.muted }]}>
                Create a strong password and confirm it to continue.
              </Text>

              {/* Email */}
              <Text style={[styles.label, { color: COLORS.label }]}>Email</Text>
              <TextInput
                mode="flat"
                value={email}
                onChangeText={setEmail}
                placeholder="joedoe75@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                style={[styles.input, { backgroundColor: COLORS.inputBg }]}
                contentStyle={styles.inputContent}
                placeholderTextColor={COLORS.muted}
                textColor={COLORS.titleText}
                left={<TextInput.Icon icon="email-outline" color={COLORS.muted} />}
                theme={{ roundness: 14 }}
              />

              {/* New Password */}
              <Text style={[styles.label, { color: COLORS.label, marginTop: 12 }]}>
                New Password
              </Text>
              <TextInput
                mode="flat"
                value={password}
                onChangeText={setPassword}
                placeholder="•••••••"
                secureTextEntry={!showPass}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                style={[styles.input, { backgroundColor: COLORS.inputBg }]}
                contentStyle={styles.inputContent}
                placeholderTextColor={COLORS.muted}
                textColor={COLORS.titleText}
                left={<TextInput.Icon icon="lock-outline" color={COLORS.muted} />}
                right={
                  <TextInput.Icon
                    icon={showPass ? "eye-off-outline" : "eye-outline"}
                    color={COLORS.muted}
                    onPress={() => setShowPass((v) => !v)}
                  />
                }
                theme={{ roundness: 14 }}
              />

              {/* Confirm Password */}
              <Text style={[styles.label, { color: COLORS.label, marginTop: 12 }]}>
                Confirm Password
              </Text>
              <TextInput
                mode="flat"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="•••••••"
                secureTextEntry={!showConfirm}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                style={[styles.input, { backgroundColor: COLORS.inputBg }]}
                contentStyle={styles.inputContent}
                placeholderTextColor={COLORS.muted}
                textColor={COLORS.titleText}
                left={<TextInput.Icon icon="lock-check-outline" color={COLORS.muted} />}
                right={
                  <TextInput.Icon
                    icon={showConfirm ? "eye-off-outline" : "eye-outline"}
                    color={COLORS.muted}
                    onPress={() => setShowConfirm((v) => !v)}
                  />
                }
                theme={{ roundness: 14 }}
              />

              <HelperText type="error" visible={!!localErr || !!resetError} style={{ marginTop: 6 }}>
                {resetError || localErr}
              </HelperText>

              {!!resetMessage && (
                <View style={[styles.successBox, { backgroundColor: COLORS.successBg }]}>
                  <Text style={[styles.successText, { color: COLORS.titleText }]}>
                    {resetMessage}
                  </Text>
                </View>
              )}

              {/* Reset Button */}
              <Button
                mode="contained"
                onPress={onSubmit}
                loading={resetLoading}
                disabled={resetLoading || !!localErr}
                buttonColor={COLORS.btnBlue}
                textColor="#000"
                style={styles.loginBtn}
                contentStyle={styles.loginBtnContent}
                labelStyle={styles.loginBtnLabel}
              >
                Reset Password
              </Button>

              {/* Back */}
              <TouchableOpacity onPress={() => navigation.popToTop()}>
                <Text style={[styles.forgot, { color: COLORS.link }]}>Back to Login</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 14 : 32,
  },

  logo: { width: 180, height: 60 },

  bottom: { flex: 1, justifyContent: "flex-end" },

  cardAnimWrap: { width: "100%" },

  card: {
    width: "100%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",

    // ✅ makes card visible in dark mode
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
  },

  welcome: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 24,
  },

  sub: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 4,
  },

  input: { height: 44, borderRadius: 14, overflow: "hidden" },

  inputContent: { height: 44 },

  successBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
  },

  successText: { fontSize: 12, fontWeight: "800" },

  loginBtn: { marginTop: 14, borderRadius: 18 },

  loginBtnContent: { height: 46 },

  loginBtnLabel: { fontSize: 14, fontWeight: "800" },

  forgot: {
    marginTop: 12,
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
