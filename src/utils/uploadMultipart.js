import AsyncStorage from "@react-native-async-storage/async-storage";

export async function postMultipart(path, formData) {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL; // e.g. https://tico.getmysolutions.in/api/v1
  const token = await AsyncStorage.getItem("auth_token");
  const tenant =
    (await AsyncStorage.getItem("tenant")) || process.env.EXPO_PUBLIC_TENANT;

  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(tenant ? { "X-Tenant": tenant } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // ✅ DO NOT set Content-Type for FormData (boundary must be auto)
    },
    body: formData,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.message || `HTTP ${res.status}`);
  }

  return json;
}
