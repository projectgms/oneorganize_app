import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../laravelApiClient"; // adjust if your path differs
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from "../slices/authSlice";
import Toast from "react-native-toast-message";

// helper to extract backend error message safely
const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

const safeSet = async (k, v) => {
  try {
    await AsyncStorage.setItem(k, v);
  } catch (e) {}
};

const safeRemoveMany = async (keys = []) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {}
};
const extractLoginData = (res) => {
  // supports: {data:{token,user}} OR {token,user} OR {data:{access_token,user}} etc.
  const raw = res?.data;
  const d1 = raw?.data ?? raw;
  const d2 = d1?.data ?? d1;

  const token =
    d2?.token ||
    d2?.access_token ||
    d1?.token ||
    d1?.access_token ||
    raw?.token ||
    raw?.access_token;

  const user = d2?.user || d1?.user || raw?.user;

  return { token, user };
};

// LOGIN
// function* handleLogin(action) {
//   try {
//     // action.payload: { email, password } (or your backend fields)
//     const res = yield call(api.post, "/auth/login", action.payload);
//     // Expecting: { token, user } OR { data: { token, user } }
//     const data = res?.data?.data || res?.data;
//     yield put(loginSuccess({ token: data?.token, user: data?.user }));
//   } catch (err) {
//     yield put(loginFailure(getErrorMessage(err)));
//   }
// }
function* handleLogin(action) {
  try {
    const { email, password, tenant } = action.payload || {};
    const finalTenant = tenant || process.env.EXPO_PUBLIC_TENANT;

    // ensure tenant available for interceptor/header
    if (finalTenant) yield call(safeSet, "tenant", String(finalTenant));

    // API call
    const res = yield call(api.post, "/auth/login", { email, password });

    // your exact response format
    const payload = res?.data;
    const data = payload?.data;

    const token = data?.access_token;
    const tokenType = data?.token_type || "Bearer";
    const expiresIn = data?.expires_in;

    const user = data?.user || null;
    const roles = user?.roles || [];
    const permissions = user?.permissions || [];
    const brandSettings = data?.brand_settings || null;

    if (!token) throw new Error("access_token missing in response");

    // persist token + useful stuff
    yield call(safeSet, "auth_token", String(token));
    yield call(safeSet, "auth_token_type", String(tokenType));
    yield call(safeSet, "auth_user", JSON.stringify(user || null));
    yield call(safeSet, "auth_permissions", JSON.stringify(permissions || []));
    yield call(
      safeSet,
      "auth_brand_settings",
      JSON.stringify(brandSettings || null),
    );

    yield put(
      loginSuccess({
        token,
        tokenType,
        expiresIn,
        tenant: finalTenant,
        user,
        roles,
        permissions,
        brandSettings,
      }),
    );
  } catch (err) {
    yield put(loginFailure(getErrorMessage(err)));
  }
}
// FORGOT
function* handleForgotPassword(action) {
  try {
    const payload = action.payload || {};
    const email = typeof payload === "string" ? payload : payload?.email;

    const tenant = payload?.tenant || process.env.EXPO_PUBLIC_TENANT;
    if (tenant) yield call(safeSet, "tenant", String(tenant));

    if (!email) throw new Error("Email is required");

    const res = yield call(api.post, "/auth/forgot-password", { email });

    // ✅ try to read token from response (adjust paths if needed)
    const token =
      res?.data?.data?.token ||
      res?.data?.token ||
      res?.data?.data?.reset_token ||
      res?.data?.reset_token ||
      "";

    const msg =
      res?.data?.message ||
      res?.data?.data?.message ||
      "Reset instructions sent";

    // ✅ store token in redux so screen can navigate with it
    yield put(
      forgotPasswordSuccess({
        message: msg,
        email,
        token,
      }),
    );
  } catch (err) {
    yield put(forgotPasswordFailure(getErrorMessage(err)));
  }
}

// RESET
function* handleResetPassword(action) {
  try {
    const payload = action.payload || {};

    const email = payload.email;
    const token = payload.token;

    // IMPORTANT: backend expects these keys
    const password = payload.password || payload.newPassword; // allow UI to pass newPassword too
    const confirmpassword =
      payload.confirmpassword || payload.confirm || payload.confirmPassword;

    // tenant for pre-login requests
    const tenant = payload?.tenant || process.env.EXPO_PUBLIC_TENANT;
    if (tenant) yield call(safeSet, "tenant", String(tenant));

    if (!email || !token || !password || !confirmpassword) {
      throw new Error("email, token, password, confirmpassword are required");
    }

    // ✅ matches Postman exactly
    const res = yield call(api.post, "/auth/reset-password", {
      email,
      token,
      password,
      confirmpassword,
    });

    const msg =
      res?.data?.message ||
      res?.data?.data?.message ||
      "Password reset successful";

    yield put(
      resetPasswordSuccess({
        message: msg,
        email,
      }),
    );
  } catch (err) {
    yield put(resetPasswordFailure(getErrorMessage(err)));
  }
}

// CHANGE PASSWORD
function* handleChangePassword(action) {
  try {
    const res = yield call(api.post, "/auth/change-password", action.payload);

    // console.log("change-password payload:", action.payload);
    const msg = res?.data?.message || "Password changed";
    Toast.show({
      text1: msg,
      type: "success",
    });
    yield put(changePasswordSuccess(msg));
  } catch (error) {
    const errData = error?.response?.data;
    const apiMsg = errData?.message;
    Toast.show({
      text1: apiMsg,
      type: "error",
    });
    yield put(changePasswordFailure(getErrorMessage(errData)));
  }
}
function* handleLogout() {
  const keysToClear = [
    "auth_token",
    "auth_token_type",
    "auth_user",
    "auth_permissions",
    "auth_brand_settings",
    // "tenant", // optional
  ];

  try {
    // backend logout (Authorization + X-Tenant will be added by interceptor)
    yield call(api.post, "/auth/logout");

    // clear local storage
    yield call(safeRemoveMany, keysToClear);

    yield put(logoutSuccess());
  } catch (err) {
    // even if API fails, still clear local session
    yield call(safeRemoveMany, keysToClear);

    yield put(logoutFailure(getErrorMessage(err)));
    yield put(logoutSuccess()); // force UI logout
  }
}
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
  yield takeLatest(resetPasswordRequest.type, handleResetPassword);
  yield takeLatest(changePasswordRequest.type, handleChangePassword);
  yield takeLatest(logoutRequest.type, handleLogout);
}
