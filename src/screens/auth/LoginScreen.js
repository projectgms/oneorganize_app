import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
    ScrollView,               // ✅ ADD
  Keyboard,                 // ✅ ADD
  TouchableWithoutFeedback,
  InteractionManager,
} from "react-native";
import { Button, HelperText, TextInput, Text, Card, Checkbox } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, clearAuthError } from "../../store/slices/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeModeContext";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { paperTheme } = useThemeMode();

  const COLORS = useMemo(() => {
    const c = paperTheme.colors;
    const isDark = !!paperTheme.dark;

    // ✅ Make card visibly separated in dark mode
    // In MD3 dark: background is very dark, surface can be close. Use elevation surfaces.
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

      isDark,
    };
  }, [paperTheme]);

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
    if (token) navigation.replace("Dashboard");
  }, [token, navigation]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const onSubmit = () => {
    dispatch(
      loginRequest({
        email,
        password,
        tenant: process.env.EXPO_PUBLIC_TENANT,
      })
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: COLORS.screenBg }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ ANDROID FIX
      keyboardVerticalOffset={0}

    >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
      {/* TOP */}
      <View style={styles.top}>
        <Image
          source={require("../../../assets/gms.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* BOTTOM */}
      <View style={styles.bottom}>
        <Animated.View style={[styles.cardAnimWrap, { transform: [{ translateY }], opacity }]}>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: COLORS.cardBg,
                borderTopWidth: COLORS.isDark ? 1 : 0,     // ✅ subtle separator
                borderLeftWidth: COLORS.isDark ? 1 : 0,
                borderRightWidth: COLORS.isDark ? 1 : 0,
                borderColor: COLORS.cardBorder,
              },
            ]}
          >
            <Card.Content>
              <Text style={[styles.welcome, { color: COLORS.titleText }]}>
                Welcome back{"\n"}Login now!
              </Text>

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
                textColor={COLORS.titleText}
                placeholderTextColor={COLORS.muted}
                left={<TextInput.Icon icon="email-outline" color={COLORS.muted} />}
                theme={{ roundness: 14 }}
              />

              <Text style={[styles.label, { color: COLORS.label, marginTop: 12 }]}>
                Password
              </Text>
              <TextInput
                mode="flat"
                value={password}
                onChangeText={setPassword}
                placeholder="•••••••"
                secureTextEntry={!showPassword}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                style={[styles.input, { backgroundColor: COLORS.inputBg }]}
                contentStyle={styles.inputContent}
                textColor={COLORS.titleText}
                placeholderTextColor={COLORS.muted}
                left={<TextInput.Icon icon="lock-outline" color={COLORS.muted} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    color={COLORS.muted}
                    onPress={() => setShowPassword((v) => !v)}
                  />
                }
                theme={{ roundness: 14 }}
              />

              <HelperText type="error" visible={!!error} style={{ marginTop: 6 }}>
                {error}
              </HelperText>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.rememberWrap}
                  activeOpacity={0.8}
                  onPress={() => setRemember((v) => !v)}
                >
                  <Checkbox
                    status={remember ? "checked" : "unchecked"}
                    onPress={() => setRemember((v) => !v)}
                    color={COLORS.brandBlue}
                  />
                  <Text style={[styles.rememberText, { color: COLORS.muted }]}>
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                  <Text style={[styles.forgot, { color: COLORS.link }]}>
                    Forget password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                disabled={loading}
                buttonColor={COLORS.btnBlue}
                textColor="#fff"
                style={styles.loginBtn}
                contentStyle={styles.loginBtnContent}
                labelStyle={styles.loginBtnLabel}
              >
                Login
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
    overflow: "hidden",

    // ✅ stronger separation (esp Android)
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
    marginBottom: 18,
    lineHeight: 24,
  },

  label: { fontSize: 12, fontWeight: "700", marginBottom: 6, marginLeft: 4 },

  input: { height: 44, borderRadius: 14, overflow: "hidden" },

  inputContent: { height: 44 },

  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rememberWrap: { flexDirection: "row", alignItems: "center", marginLeft: -10 },

  rememberText: { fontSize: 12, fontWeight: "600" },

  forgot: { fontSize: 12, fontWeight: "700" },

  loginBtn: { marginTop: 14, borderRadius: 18 },

  loginBtnContent: { height: 46 },

  loginBtnLabel: { fontSize: 14, fontWeight: "800" },
});
