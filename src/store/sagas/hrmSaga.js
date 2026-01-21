import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../laravelApiClient";
import {
  fetchHrmOverviewRequest,
  fetchHrmOverviewSuccess,
  fetchHrmOverviewFailure,
} from "../slices/hrmSlice";

const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

function* handleFetchHrmOverview() {
  try {
    const res = yield call(api.get, "/hr/hrm-overview");
    const payload = res?.data?.data; // ✅ your real response: {success,message,data:{...}}

    console.log("HRM DATA: ", payload);
    yield put(fetchHrmOverviewSuccess(payload));
  } catch (err) {
    yield put(fetchHrmOverviewFailure(getErrorMessage(err)));
  }
}

export default function* hrmSaga() {
  yield takeLatest(fetchHrmOverviewRequest.type, handleFetchHrmOverview);
}
