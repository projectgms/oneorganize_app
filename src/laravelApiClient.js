// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const api = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // e.g. https://domain.com/api/v1
//   timeout: 20000,
//   headers: {
//     Accept: "application/json",
//     // ✅ DO NOT set Content-Type globally
//     // Let axios set it automatically based on payload (JSON vs FormData)
//   },
// });

// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("auth_token");
//   const tenant =
//     (await AsyncStorage.getItem("tenant")) || process.env.EXPO_PUBLIC_TENANT;

//   config.headers = config.headers || {};

//   if (tenant) config.headers["X-Tenant"] = tenant;
//   if (token) config.headers.Authorization = `Bearer ${token}`;

//   // ✅ If FormData, remove any content-type so RN can attach boundary correctly
//   const isFormData =
//     typeof FormData !== "undefined" && config.data instanceof FormData;

//   if (isFormData) {
//     delete config.headers["Content-Type"];
//     delete config.headers["content-type"];
//     // IMPORTANT: Don't manually set multipart/form-data either (boundary needed)
//   } else {
//     // ✅ For normal JSON requests, set JSON content-type explicitly
//     config.headers["Content-Type"] = "application/json";
//   }

//   return config;
// });

// export default api;


import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // https://tico.getmysolutions.in/api/v1
  timeout: 60000, // ✅ 60s
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  const tenant =
    (await AsyncStorage.getItem("tenant")) || process.env.EXPO_PUBLIC_TENANT;

  config.headers = config.headers || {};
  if (tenant) config.headers["X-Tenant"] = tenant;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // ✅ DO NOT force Content-Type globally; axios handles JSON itself
  return config;
});

export default api;
