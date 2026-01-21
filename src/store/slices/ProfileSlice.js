import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileLoading: false,
  data: null,
  error: null,
};

const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {
    getProfileReq: (state, action) => {
      state.profileLoading = true;
    },
    getProfileSucc: (state, action) => {
      state.profileLoading = false;
      state.data = action.payload;
    },
    getProfileFail: (state, action) => {
      state.profileLoading = false;
      state.error = action.payload;
    },

    updateProfileReq: (state, action) => {
      state.profileLoading = true;
    },
    updateProfileSucc: (state, action) => {
      state.profileLoading = false;
    },
    updateProfileFail: (state, action) => {
      state.profileLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProfileFail,
  getProfileReq,
  getProfileSucc,
  updateProfileFail,
  updateProfileReq,
  updateProfileSucc,
} = profileSlice.actions;

export default profileSlice.reducer;
