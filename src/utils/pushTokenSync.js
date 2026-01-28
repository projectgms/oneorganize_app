import { Platform } from "react-native";
import api from "../laravelApiClient";
import {
  registerForPushTokenAsync,
  saveExpoPushToken,
} from "../services/pushNotifications";

export async function syncPushTokenToServer(authToken) {
  try {
    if (!authToken) {
      console.log("❌ No JWT token available for push sync");
      return null;
    }

    const expoToken = await registerForPushTokenAsync();

    if (!expoToken) {
      console.log("❌ Push token not generated");
      return null;
    }

    // ✅ IMPORTANT:
    // use "device-tokens" NOT "/device-tokens"
    // because baseURL already includes /api/v1
    const res = await api.post(
      "device-tokens",
      {
        token: expoToken,
        platform: Platform.OS,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // ✅ force JWT
          "X-Tenant": process.env.EXPO_PUBLIC_TENANT, // ✅ force tenant
        },
      }
    );

    console.log("✅ Device token synced:", res?.data);

    // ✅ Save locally ONLY AFTER server success
    await saveExpoPushToken(expoToken);

    return expoToken;
  } catch (e) {
    console.log(
      "❌ syncPushTokenToServer error:",
      e?.response?.status,
      e?.response?.data || e?.message || e
    );
    return null;
  }
}
