import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // e.g. https://domain.com/api/v1
  timeout: 20000,
  // headers: {
  //   Accept: "application/json",
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  const tenant = (await AsyncStorage.getItem("tenant")) || process.env.EXPO_PUBLIC_TENANT;

  if (tenant) config.headers["X-Tenant"] = tenant;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
