import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {
    listLoading: false,
    createLeaveLoading: false,
  },
  data: null,
  error: null,
};

const leaveManagementSlice = createSlice({
  name: "leaveManagement",
  initialState,
  reducers: {
    createLeaveReq: (state, action) => {
      state.loading.createLeaveLoading = true;
    },
    createLeaveSucc: (state, action) => {
      state.loading.createLeaveLoading = false;
      state.data = action.payload;
    },
    createLeaveFail: (state, action) => {
      state.loading.createLeaveLoading = false;
      state.error = action.payload;
    },
  },
});


export const {createLeaveFail, createLeaveReq, createLeaveSucc} = leaveManagementSlice.actions;

export default leaveManagementSlice.reducer;

