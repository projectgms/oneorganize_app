import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hrmReducer from "./slices/hrmSlice";
const rootReducer = combineReducers({
  auth: authReducer,
    hrm: hrmReducer,
});

export default rootReducer;
