import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const PUSH_TOKEN_KEY = "expo_push_token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function getProjectId() {
  return (
    Constants?.expoConfig?.extra?.eas?.projectId ||
    Constants?.easConfig?.projectId ||
    undefined
  );
}

export async function getStoredExpoPushToken() {
  try {
    return await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveExpoPushToken(token) {
  try {
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  } catch {}
}

export async function registerForPushTokenAsync() {
  // ✅ Must be real device
  if (!Device.isDevice) {
    console.log("❌ Push requires physical device");
    return null;
  }

  // ✅ Android channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
    });
  }

  // ✅ Permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Push permission not granted");
    return null;
  }

  const projectId = getProjectId();
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await saveExpoPushToken(token);
  return token;
}

export function addPushListeners({ onReceive, onTap } = {}) {
  const sub1 = Notifications.addNotificationReceivedListener((notification) => {
    onReceive?.(notification);
  });

  const sub2 = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onTap?.(response);
    }
  );

  return () => {
    sub1.remove();
    sub2.remove();
  };
}
