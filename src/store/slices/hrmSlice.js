import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  overview: null,
  employeeAttendance: null,
  loading: false,
  error: null,
  birthdays: null,
  annoucements: null,
  joiningAnniversary: null,
  todaysLeave: null,
  user: null,
};

const hrmSlice = createSlice({
  name: "hrm",
  initialState,
  reducers: {
    fetchHrmOverviewRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHrmOverviewSuccess: (state, action) => {
      state.loading = false;
      state.overview = action.payload || null;
      state.employeeAttendance = action.payload?.employeeAttendance || null;
      state.birthdays = action.payload?.birthday;
      state.annoucements = action.payload?.announcements;
      state.joiningAnniversary = action.payload?.joining_date;
      state.todaysLeave = action.payload?.todays_leave;
      state.user= action.payload?.emp;
    },
    fetchHrmOverviewFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load HRM overview";
    },
    clearHrmError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchHrmOverviewRequest,
  fetchHrmOverviewSuccess,
  fetchHrmOverviewFailure,
  clearHrmError,
} = hrmSlice.actions;

export default hrmSlice.reducer;
