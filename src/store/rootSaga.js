import { all, fork } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import hrmSaga from "./sagas/hrmSaga";
export default function* rootSaga() {
 yield all([fork(authSaga), fork(hrmSaga)]);
}
