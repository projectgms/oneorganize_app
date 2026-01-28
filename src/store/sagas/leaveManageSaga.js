import { takeLatest, call, put } from "redux-saga/effects";

import {
  createLeaveFail,
  createLeaveReq,
  createLeaveSucc,
  getLeaveDetailsFail, 
  getLeaveDetailsReq,
  getLeaveDetailsSucc,
} from "./../../store/slices/leaveManageSlice";
import api from "./../../laravelApiClient";
import Toast from "react-native-toast-message";

const createLeaveApi = async (payload) => {
  const res = await api.post("/hr/create-leaves", payload);
  return res.data;
};

const leaveDetailsApi = async (payload) => {
  const res = await api.post('/hr/leaves', payload);
  return res.data;
}

function* handleCreateLeave(action) {
  try {
    const res = yield call(createLeaveApi, action.payload);

    console.log("leave Data: ", action.payload)

    yield put(createLeaveSucc(res.data));

    Toast.show({
      text1: "Leave Created Successfully!",
      type: "success",
    });
  } catch (error) {
    const errData = error?.response?.data;
    const apiMsg = errData?.message;
    Toast.show({
      text1: apiMsg,
      type: "error",
    });
    yield put(createLeaveFail(errData));
  }
};


function* handleGetLeaveDetails(action){
  try {
    
    const res = yield call(leaveDetailsApi, action.payload);
    yield put(getLeaveDetailsSucc(res.data));

  } catch (error) {
    const errData = error?.response?.data;
    const apiMsg = errData?.message;

    yield put(getLeaveDetailsFail(apiMsg));
  }
}


export default function* watchLeaveManageSaga(){
    yield takeLatest(createLeaveReq.type, handleCreateLeave);
    yield takeLatest(getLeaveDetailsReq.type, handleGetLeaveDetails);
}
