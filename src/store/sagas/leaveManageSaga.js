import { takeLatest, call, put } from "redux-saga/effects";

import {
  createLeaveFail,
  createLeaveReq,
  createLeaveSucc,
  getLeaveDetailsFail,
  getLeaveDetailsReq,
  getLeaveDetailsSucc,
  getAvailLeavesDataFail,
  getAvailLeavesDataReq,
  getAvailLeavesDataSucc,

  // ✅ NEW
  getLeaveDatesReq,
  getLeaveDatesSucc,
  getLeaveDatesFail,
  updateLeaveStatusReq,
  updateLeaveStatusSucc,
  updateLeaveStatusFail,
  updateBulkLeaveFail,
  updateBulkLeaveReq,
  updateBulkLeaveSucc,
} from "./../../store/slices/leaveManageSlice";

import api from "./../../laravelApiClient";
import Toast from "react-native-toast-message";

// existing APIs
const createLeaveApi = async (payload) => {
  const res = await api.post("/hr/create-leaves", payload);
  return res.data;
};

const leaveDetailsApi = async (payload) => {
  const res = await api.post("/hr/leaves", payload);
  return res.data;
};

const getAvailLeavesApi = async (payload) => {
  const res = await api.post("/hr/leave-details", payload);
  return res.data;
};

// ✅ NEW API: leave dates by leaveId
const getLeaveDatesApi = async (payload) => {
  const res = await api.get(`/hr/get-leaves/${payload}`);
  return res.data;
};

// ✅ NEW API: update leave-date row
const updateLeaveStatusApi = async (payload) => {
  const res = await api.patch(`/hr/update-leaves/${payload.id}`, payload);
  return res.data;
};

const updateBulkLeaveApi = async (payload) => {
  const res = await api.post("/hr/bulk-leave-update", payload);
  return res.data;
};

// ---------------- existing handlers ----------------
function* handleCreateLeave(action) {
  try {
    const res = yield call(createLeaveApi, action.payload);
    yield put(createLeaveSucc(res.data));

    Toast.show({ text1: "Leave Created Successfully!", type: "success" });
  } catch (error) {
    const errData = error?.response?.data;
    Toast.show({ text1: errData?.message, type: "error" });
    yield put(createLeaveFail(errData));
  }
}

function* handleGetLeaveDetails(action) {
  try {
    const res = yield call(leaveDetailsApi, action.payload);
    yield put(getLeaveDetailsSucc(res.data));
  } catch (error) {
    const errData = error?.response?.data;
    yield put(getLeaveDetailsFail(errData?.message));
  }
}

function* handleGetAvailLeaves(action) {
  try {
    const res = yield call(getAvailLeavesApi, action.payload);
    yield put(getAvailLeavesDataSucc(res.data));
  } catch (error) {
    const errData = error?.response?.data;
    yield put(getAvailLeavesDataFail(errData?.message));
  }
}

// ---------------- ✅ NEW handlers ----------------

// 1) GET /hr/get-leaves/{leaveId}
function* handleGetLeaveDates(action) {
  try {
    // console.log("action.payload for getLeaveDatesApi:", action.payload)
    const res = yield call(getLeaveDatesApi, action.payload);
    // backend may return { data: [...] } or directly [...]
    const list = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];
    yield put(getLeaveDatesSucc(list));
  } catch (error) {
    const errData = error?.response?.data;
    yield put(
      getLeaveDatesFail(errData?.message || "Failed to load leave dates"),
    );
  }
}

// 2) PATCH /hr/update-leaves/{id}
function* handleUpdateLeaveStatus(action) {
  try {
    // console.log("handleUpdateLeaveStatus action.payload --", action.payload)
    const updatePayload = {
      id: action.payload.id,
      status: action.payload.status,
      leave_type: action.payload.leave_type,
      comment: action.payload.comment,
    };
    const res = yield call(updateLeaveStatusApi, updatePayload);

    const LeaveID = action.payload.leave_id;

    // normalize updated row
    // const updated = res?.data ?? res;

    yield put(updateLeaveStatusSucc());

    yield put(getLeaveDatesReq(LeaveID));

    Toast.show({
      text1: "Status Updated",
      type: "success",
    });
  } catch (error) {
    const errData = error?.response?.data;
    Toast.show({ text1: errData?.message || "Update failed", type: "error" });
    yield put(
      updateLeaveStatusFail(errData?.message || "Failed to update status"),
    );
  }
}

function* handleUpdateLeaveBulk(action) {
  try {

    const updatePayload = {
      id: action.payload.id,
      status: action.payload.status,
      leave_type: action.payload.leave_type,
      comment: action.payload.comment,
    };
    const res = yield call(updateBulkLeaveApi, updatePayload);
    const LeaveID = action.payload.leave_id;
    yield put(getLeaveDatesReq(LeaveID));


    yield put(updateBulkLeaveSucc());
    Toast.show({
      text1: "Status Updated",
      type: "success",
    });
  } catch (error) {
    const errData = error?.response?.data;
    Toast.show({ text1: errData?.message || "Update failed", type: "error" });
    yield put(
      updateBulkLeaveFail(errData?.message || "Failed to update status"),
    );
  }
}

export default function* watchLeaveManageSaga() {
  yield takeLatest(createLeaveReq.type, handleCreateLeave);
  yield takeLatest(getLeaveDetailsReq.type, handleGetLeaveDetails);
  yield takeLatest(getAvailLeavesDataReq.type, handleGetAvailLeaves);

  // ✅ NEW watchers
  yield takeLatest(getLeaveDatesReq.type, handleGetLeaveDates);
  yield takeLatest(updateLeaveStatusReq.type, handleUpdateLeaveStatus);
  yield takeLatest(updateBulkLeaveReq.type, handleUpdateLeaveBulk);
}
