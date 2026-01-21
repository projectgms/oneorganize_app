import { all, fork } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import hrmSaga from "./sagas/hrmSaga";
import watchProfileSaga from './sagas/ProfileSaga'

export default function* rootSaga() {
 yield all([fork(authSaga), fork(hrmSaga), fork(watchProfileSaga)]);
}
