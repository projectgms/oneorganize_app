import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todayTaskLoading: false,
  todayTasks: null,
  todayTaskError: null,
};

const todaysTaskSlice = createSlice({
  name: "todayTaskSlice",
  initialState,
  reducers: {
    fetchTodayTaskRequest: (state) => {
      state.todayTaskLoading = true;
      state.todayTaskError = null;
    },
    fetchTodayTaskSuccess: (state, action) => {
      state.todayTaskLoading = false;
      state.todayTasks = action.payload;
      state.todayTaskError = null;
    },
    fetchTodayTaskFailure: (state, action) => {
      state.todayTaskLoading = false;
      state.todayTaskError = action.payload;
    },
  },
});


export const {fetchTodayTaskFailure, fetchTodayTaskRequest, fetchTodayTaskSuccess} = todaysTaskSlice.actions;

export default todaysTaskSlice.reducer;
