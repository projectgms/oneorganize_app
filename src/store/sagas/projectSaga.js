import { call, put, takeLatest } from "redux-saga/effects";
import {
  getProjectDataReq,
  getProjectDataSucc,
  getProjectDataFail,
  getDelayedTaskFail,
  getDelayedTaskReq,
  getDelayedTaskSucc,
} from "./../slices/projectSlice";
import api from "./../../laravelApiClient";

const getProjectsDataApi = async () => {
  const res = await api.get("/projects");
  return res.data;
};

const getDelayedTaskApi = async () => {
  const res = await api.get("/today-delay-task");
  return res.data;
};

function* handleGetProjectDataSaga() {
  try {
    const res = yield call(getProjectsDataApi);

    yield put(getProjectDataSucc(res?.data));
  } catch (error) {
    yield put(getProjectDataFail(error.message));
  }
};

function* handleGetDelayedTaskSaga(){
    try {
        
        const res = yield call(getDelayedTaskApi);

        yield put(getDelayedTaskSucc(res.data));

    } catch (error) {
        yield put(getDelayedTaskFail(error.message)); 
    }
}

export default function* watchProjectSaga() {
  yield takeLatest(getProjectDataReq.type, handleGetProjectDataSaga);
  yield takeLatest(getDelayedTaskReq.type, handleGetDelayedTaskSaga);
}
