import { Platform } from "react-native";
import api from "../laravelApiClient";
import {
  registerForPushTokenAsync,
  getStoredExpoPushToken,
} from "../services/pushNotifications";

export async function syncPushTokenToServer() {
  try {
    const oldToken = await getStoredExpoPushToken();
    const newToken = await registerForPushTokenAsync();

    if (!newToken) {
      console.log("❌ Push token not generated");
      return null;
    }

    if (oldToken === newToken) {
      console.log("✅ Push token unchanged");
      return newToken;
    }

    const res = await api.post("/device-tokens", {
      token: newToken,
      platform: Platform.OS,
    });

    console.log("✅ Device token synced:", res?.data);
    return newToken;
  } catch (e) {
    console.log(
      "❌ syncPushTokenToServer error:",
      e?.response?.data || e?.message || e
    );
    return null;
  }
}
