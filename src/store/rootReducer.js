import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { logoutSuccess } from "./slices/authSlice";
import hrmReducer from "./slices/hrmSlice";
import profileReducer from "./slices/ProfileSlice";
import leaveManageReducer from "./slices/leaveManageSlice";
import todayTasksReducer from './slices/todaysSlice';

const appReducer = combineReducers({
  auth: authReducer,
  hrm: hrmReducer,
  profile: profileReducer,
  leaveManage: leaveManageReducer,
  todayTasks: todayTasksReducer,
});

// ✅ THIS resets ALL slices when logoutSuccess happens
const rootReducer = (state, action) => {
  if (action.type === logoutSuccess.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
