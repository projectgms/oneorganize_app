import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {
    listLoading: false,
    createLeaveLoading: false,
  },
  data: null,
  leaveDetailList: null,
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

    getLeaveDetailsReq: (state, action) => {
      state.loading.listLoading = true;
    },
    getLeaveDetailsSucc: (state, action) => {
      state.loading.listLoading = false;
      state.leaveDetailList = action.payload;
    },
    getLeaveDetailsFail: (state, action) => {
      state.loading.listLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createLeaveFail,
  createLeaveReq,
  createLeaveSucc,
  getLeaveDetailsFail,
  getLeaveDetailsReq,
  getLeaveDetailsSucc,
} = leaveManagementSlice.actions;

export default leaveManagementSlice.reducer;
