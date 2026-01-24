import { call, put, takeLatest, select } from "redux-saga/effects";
import api from "../../laravelApiClient";
import Toast from "react-native-toast-message";

import {
  getProfileFail,
  getProfileReq,
  getProfileSucc,
  updateProfileFail,
  updateProfileReq,
  updateProfileSucc,
} from "../slices/ProfileSlice";

import { postMultipart } from "../../utils/uploadMultipart"; // ✅ change path if needed

const selectToken = (s) => s.auth.token;

const pickData = (payload) => payload?.data ?? payload;

const pickErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Network Error"
  );
};

function* handleGetProfile() {
  const tokenAtStart = yield select(selectToken);
  if (!tokenAtStart) return;

  try {
    const res = yield call(api.get, "/profile");

    const tokenNow = yield select(selectToken);
    if (!tokenNow || tokenNow !== tokenAtStart) return;

    yield put(getProfileSucc(pickData(res?.data)));
  } catch (error) {
    yield put(getProfileFail(pickErrorMessage(error)));
  }
}

function* handleUpdateProfile(action) {
  const tokenAtStart = yield select(selectToken);
  if (!tokenAtStart) return;

  try {
    // ✅ IMPORTANT: use fetch for multipart (fixes Android Network Error)
    const payload = yield call(postMultipart, "/update-profile", action.payload);

    const tokenNow = yield select(selectToken);
    if (!tokenNow || tokenNow !== tokenAtStart) return;

    const data = pickData(payload);
    yield put(updateProfileSucc(data));

    Toast.show({ type: "success", text1: "Profile updated" });

    // ✅ refresh to ensure latest image url from server
    yield put(getProfileReq());
  } catch (error) {
    const msg = pickErrorMessage(error);
    yield put(updateProfileFail(msg));
    Toast.show({ type: "error", text1: "Upload failed", text2: msg });
  }
}

export default function* watchProfileSaga() {
  yield takeLatest(getProfileReq.type, handleGetProfile);
  yield takeLatest(updateProfileReq.type, handleUpdateProfile);
}
