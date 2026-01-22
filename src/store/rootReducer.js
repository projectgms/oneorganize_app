import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hrmReducer from "./slices/hrmSlice";
import profileReducer from "./slices/ProfileSlice";
import leaveManageReducer from "./slices/leaveManageSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  hrm: hrmReducer,
  profile: profileReducer, 
  leaveManage: leaveManageReducer, 
});

export default rootReducer;
