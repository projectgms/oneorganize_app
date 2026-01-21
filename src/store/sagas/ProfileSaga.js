import { call, put, takeLatest } from 'redux-saga/effects';

import {getProfileFail, getProfileReq, getProfileSucc, updateProfileFail, updateProfileReq, updateProfileSucc} from './../../store/slices/ProfileSlice';
import api from './../../laravelApiClient';


const getProfileInfoApi = async () => {
    const res = await api.get("/profile");
    return res.data;
};

const updateProfileApi = async (payload) =>{
    const res = await api.post('/update-profile', payload);
    return res.data;
};


function* handleGetProfile(action){
    try {
        const res = yield call(getProfileInfoApi);
        yield put(getProfileSucc(res?.data));

    } catch (error) {
        yield put(getProfileFail(error?.message || error));
    }
};


function* handleUpdateProfile(action){
    try {
        const res = yield call(updateProfileApi, action.payload);
        yield put(updateProfileSucc(res))
    } catch (error) {
        yield put(updateProfileFail(error?.message || error));
    }
}


export default function* watchProfileSaga(){
    yield takeLatest(getProfileReq.type, handleGetProfile);
    yield takeLatest(updateProfileReq.type, handleUpdateProfile);
}