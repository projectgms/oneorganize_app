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
import {
  forgotPasswordRequest,
  clearForgotPasswordState,
  clearAuthError,
} from "../../store/slices/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeModeContext"; // ✅ adjust path

export default function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const { forgotLoading, forgotError, forgotMessage } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");

  // ✅ theme from provider
  const { paperTheme } = useThemeMode();

  // ✅ theme-aware colors (same logic as login)
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

      // success box colors
      successBg: isDark ? (c.elevation?.level1 ?? c.surfaceVariant) : "rgba(47,128,237,0.08)",
      isDark,
    };
  }, [paperTheme]);

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

  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordState());
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = () => {
    const val = email?.trim();
    if (!val) return;

    dispatch(
      forgotPasswordRequest({
        email: val,
        tenant: process.env.EXPO_PUBLIC_TENANT,
      })
    );
  };

  const onBackToLogin = () => {
    dispatch(clearForgotPasswordState());
    navigation.goBack();
  };

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
        <Animated.View
          style={[styles.cardAnimWrap, { transform: [{ translateY }], opacity }]}
        >
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
                Forgot Password{"\n"}Reset your account!
              </Text>

              <Text style={[styles.sub, { color: COLORS.muted }]}>
                Enter your email and we’ll send a reset link.
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

              <HelperText type="error" visible={!!forgotError} style={{ marginTop: 6 }}>
                {forgotError}
              </HelperText>

              {!!forgotMessage && (
                <View style={[styles.successBox, { backgroundColor: COLORS.successBg }]}>
                  <Text style={[styles.successText, { color: COLORS.titleText }]}>
                    {forgotMessage}
                  </Text>
                  <Text style={[styles.successHint, { color: COLORS.muted }]}>
                    Please check your email and open the reset link.
                  </Text>
                </View>
              )}

              {/* Send Button */}
              <Button
                mode="contained"
                onPress={onSubmit}
                loading={forgotLoading}
                disabled={forgotLoading}
                buttonColor={COLORS.btnBlue}
                textColor="#fff"
                style={styles.loginBtn}
                contentStyle={styles.loginBtnContent}
                labelStyle={styles.loginBtnLabel}
              >
                Send Reset Link
              </Button>

              {/* Back to login */}
              <TouchableOpacity onPress={onBackToLogin}>
                <Text style={[styles.forgot, { color: COLORS.link }]}>
                  Back to Login
                </Text>
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

    // ✅ makes card visible in dark mode too
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

  successHint: { marginTop: 4, fontSize: 11, fontWeight: "600" },

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
