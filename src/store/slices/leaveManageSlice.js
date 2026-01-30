import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {
    listLoading: false,
    createLeaveLoading: false,
    avialLeavesLoading: false,

    // ✅ NEW
    leaveDatesLoading: false,
    updateLeaveStatusLoading: false,
  },
  data: null,
  leaveDetailList: null,
  avialLeavesData: null,

  // ✅ NEW
  leaveDatesList: null, // array of rows from /hr/get-leaves/{leaveId}

  error: null,
};

const leaveManagementSlice = createSlice({
  name: "leaveManagement",
  initialState,
  reducers: {
    createLeaveReq: (state) => {
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

    getLeaveDetailsReq: (state) => {
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

    getAvailLeavesDataReq: (state) => {
      state.loading.avialLeavesLoading = true;
    },
    getAvailLeavesDataSucc: (state, action) => {
      state.loading.avialLeavesLoading = false;
      state.avialLeavesData = action.payload;
    },
    getAvailLeavesDataFail: (state, action) => {
      state.loading.avialLeavesLoading = false;
      state.error = action.payload;
    },

    // ===========================
    // ✅ NEW: Leave dates by leaveId
    // ===========================
    getLeaveDatesReq: (state) => {
      state.loading.leaveDatesLoading = true;
      state.leaveDatesList = null;
    },
    getLeaveDatesSucc: (state, action) => {
      state.loading.leaveDatesLoading = false;
      state.leaveDatesList = action.payload;
    },
    getLeaveDatesFail: (state, action) => {
      state.loading.leaveDatesLoading = false;
      state.error = action.payload;
    },

    clearLeaveDates: (state) => {
      state.leaveDatesList = null;
    },

    // ===========================
    // ✅ NEW: Update leave date status
    // ===========================
    updateLeaveStatusReq: (state) => {
      state.loading.updateLeaveStatusLoading = true;
    },
    updateLeaveStatusSucc: (state, action) => {
      state.loading.updateLeaveStatusLoading = false;

      // ✅ update row locally so UI updates instantly
      const updated = action.payload;
      if (!updated?.id) return;

      const list = Array.isArray(state.leaveDatesList) ? state.leaveDatesList : [];
      state.leaveDatesList = list.map((x) =>
        Number(x.id) === Number(updated.id) ? { ...x, ...updated } : x
      );
    },
    updateLeaveStatusFail: (state, action) => {
      state.loading.updateLeaveStatusLoading = false;
      state.error = action.payload;
    },


    updateBulkLeaveReq:(state,action) =>{
      state.loading.updateLeaveStatusLoading = true;
    },
    updateBulkLeaveSucc:(state,action) =>{
      state.loading.updateLeaveStatusLoading = false;
    },
    updateBulkLeaveFail:(state,action) =>{
      state.loading.updateLeaveStatusLoading = false;
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
  getAvailLeavesDataFail,
  getAvailLeavesDataReq,
  getAvailLeavesDataSucc,

  // ✅ NEW exports
  getLeaveDatesReq,
  getLeaveDatesSucc,
  getLeaveDatesFail,
  clearLeaveDates,

  updateLeaveStatusReq,
  updateLeaveStatusSucc,
  updateLeaveStatusFail,


  updateBulkLeaveFail,
  updateBulkLeaveReq,
  updateBulkLeaveSucc,
} = leaveManagementSlice.actions;

export default leaveManagementSlice.reducer;
