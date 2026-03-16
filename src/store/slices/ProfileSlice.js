import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileLoading: false,
  getProfileLoading: false,
  data: null,
  error: null,

  // ✅ add this (cache bust)
  avatarVersion: 0,
};

const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {
    getProfileReq: (state) => {
      state.getProfileLoading = true;
    },
    getProfileSucc: (state, action) => {
      state.getProfileLoading = false;
      state.data = action.payload;
      state.error = null;

      // ✅ optional: bump when profile loads (if photo changed)
      state.avatarVersion += 1;
    },
    getProfileFail: (state, action) => {
      state.getProfileLoading = false;
      state.error = action.payload;
    },

    resetProfileState: (state) => {
      state.profileLoading = false;
      state.getProfileLoading = false;
      state.data = null;
      state.error = null;
      state.avatarVersion = 0;
    },

    updateProfileReq: (state) => {
      state.profileLoading = true;
    },
    updateProfileSucc: (state, action) => {
      state.profileLoading = false;
      state.error = null;

      // ✅ update local data immediately (fast UI update)
      if (action.payload) {
        state.data = action.payload;
      }

      // ✅ force image refresh in header
      state.avatarVersion += 1;
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
  resetProfileState,
  updateProfileReq,
  updateProfileSucc,
} = profileSlice.actions;

export default profileSlice.reducer;
