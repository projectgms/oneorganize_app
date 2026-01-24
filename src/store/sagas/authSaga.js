import { call, put, takeLatest, select } from "redux-saga/effects";
import api from "../../laravelApiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

  // ✅ ADD these in authSlice exports (snippet below)
  meRequest,
  meSuccess,
  meFailure,
} from "../slices/authSlice";

import {
  // ✅ make sure ProfileSlice exports this (snippet below)
  resetProfileState,
  getProfileReq,
} from "../slices/ProfileSlice";

import { fetchHrmOverviewRequest } from "../slices/hrmSlice";

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

const selectToken = (s) => s.auth.token;

// ✅ ME API (refresh logged-in user)
function* handleMe() {
  const tokenAtStart = yield select(selectToken);
  if (!tokenAtStart) return;

  try {
    const res = yield call(api.get, "/auth/me");

    // ✅ stale guard
    const tokenNow = yield select(selectToken);
    if (!tokenNow || tokenNow !== tokenAtStart) return;

    const payload = res?.data?.data || res?.data;

    const user = payload?.user || null;
    const roles = user?.roles || payload?.roles || [];
    const permissions = user?.permissions || payload?.permissions || [];
    const brandSettings = payload?.brand_settings || payload?.brandSettings || null;

    // persist latest (optional but good)
    yield call(safeSet, "auth_user", JSON.stringify(user || null));
    yield call(safeSet, "auth_permissions", JSON.stringify(permissions || []));
    yield call(safeSet, "auth_brand_settings", JSON.stringify(brandSettings || null));

    yield put(meSuccess({ user, roles, permissions, brandSettings }));
  } catch (err) {
    yield put(meFailure(getErrorMessage(err)));
  }
}

// LOGIN
function* handleLogin(action) {
  try {
    // ✅ clear old profile instantly (prevents old header)
    yield put(resetProfileState());

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
    yield call(safeSet, "auth_brand_settings", JSON.stringify(brandSettings || null));

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
      })
    );

    // ✅ IMPORTANT: refresh after login
    yield put(meRequest());
    yield put(getProfileReq());
    yield put(fetchHrmOverviewRequest());
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

    yield put(
      forgotPasswordSuccess({
        message: msg,
        email,
        token,
      })
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

    const password = payload.password || payload.newPassword;
    const confirmpassword =
      payload.confirmpassword || payload.confirm || payload.confirmPassword;

    const tenant = payload?.tenant || process.env.EXPO_PUBLIC_TENANT;
    if (tenant) yield call(safeSet, "tenant", String(tenant));

    if (!email || !token || !password || !confirmpassword) {
      throw new Error("email, token, password, confirmpassword are required");
    }

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

    yield put(resetPasswordSuccess({ message: msg, email }));
  } catch (err) {
    yield put(resetPasswordFailure(getErrorMessage(err)));
  }
}

// CHANGE PASSWORD
function* handleChangePassword(action) {
  try {
    const res = yield call(api.post, "/auth/change-password", action.payload);
    const msg = res?.data?.message || "Password changed";

    Toast.show({ text1: msg, type: "success" });
    yield put(changePasswordSuccess(msg));
  } catch (error) {
    const errData = error?.response?.data;
    Toast.show({ text1: errData?.message, type: "error" });
    yield put(changePasswordFailure(getErrorMessage(error)));
  }
}

// LOGOUT
function* handleLogout() {
  const keysToClear = [
    "auth_token",
    "auth_token_type",
    "auth_user",
    "auth_permissions",
    "auth_brand_settings",
    "tenant", // ✅ clear tenant (multi-tenant safety)
  ];

  try {
    yield call(api.post, "/auth/logout");
  } catch (e) {
    // ignore API failure
  }

  // ✅ clear local storage always
  yield call(safeRemoveMany, keysToClear);

  // ✅ clear old profile in redux
  yield put(resetProfileState());

  // ✅ auth slice clears auth state
  yield put(logoutSuccess());
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(meRequest.type, handleMe);
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
  yield takeLatest(resetPasswordRequest.type, handleResetPassword);
  yield takeLatest(changePasswordRequest.type, handleChangePassword);
  yield takeLatest(logoutRequest.type, handleLogout);
}
