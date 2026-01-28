import {fetchTodayTaskFailure, fetchTodayTaskRequest, fetchTodayTaskSuccess} from './../../store/slices/todaysSlice';
import api from './../../laravelApiClient';
import { call, put, takeLatest } from 'redux-saga/effects';


const getTodayTaskApi = async () =>{
    const res = await api.get('/today-task');
    return res.data;
};

function* handleFetchTodayTasksWorker() {
  try {
    const resp = yield call(getTodayTaskApi);
    console.log("todaytask payload", resp?.data)
    yield put(fetchTodayTaskSuccess(resp?.data));
  } catch (error) {
    const errData = error?.response?.data;
    const apiMsg = errData?.message;
    yield put(fetchTodayTaskFailure(apiMsg));
  }
}

export default function* watchTodaysTaskSaga(){
    yield takeLatest(fetchTodayTaskRequest.type, handleFetchTodayTasksWorker);
};
