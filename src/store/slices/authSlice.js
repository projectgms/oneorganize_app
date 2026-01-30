import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenType: "Bearer",
  expiresIn: null,
bootstrapping: true,

  tenant: null,

  user: null,
  roles: [],
  permissions: [],

  brandSettings: null,

  meLoading: false,
meError: null,

    resetLoading: false,
  resetError: null,
  resetMessage: null,
  resetEmail: null,

   forgotLoading: false,
  forgotError: null,
  forgotMessage: null,
  forgotEmail: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
     loginSuccess: (state, action) => {
      state.loading = false;

      state.token = action.payload?.token || null;
      state.tokenType = action.payload?.tokenType || "Bearer";
      state.expiresIn = action.payload?.expiresIn ?? null;

      state.tenant = action.payload?.tenant || null;

      state.user = action.payload?.user || null;
      state.roles = action.payload?.roles || [];
      state.permissions = action.payload?.permissions || [];

      state.brandSettings = action.payload?.brandSettings || null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    },

    // FORGOT
 forgotPasswordRequest: (state) => {
  state.forgotLoading = true;
  state.forgotError = null;
  state.forgotMessage = null;
  state.forgotEmail = null;
  state.forgotToken = null;
},
forgotPasswordSuccess: (state, action) => {
  state.forgotLoading = false;
  state.forgotMessage = action.payload?.message || "Reset link sent";
  state.forgotEmail = action.payload?.email || null;
  state.forgotToken = action.payload?.token || null; // ✅ important
},
forgotPasswordFailure: (state, action) => {
  state.forgotLoading = false;
  state.forgotError = action.payload || "Forgot password failed";
},
clearForgotPasswordState: (state) => {
  state.forgotLoading = false;
  state.forgotError = null;
  state.forgotMessage = null;
  state.forgotEmail = null;
  state.forgotToken = null;
},


meRequest: (state) => {
  state.meLoading = true;
  state.meError = null;
},
meSuccess: (state, action) => {
  state.meLoading = false;
  state.user = action.payload?.user || null;
  state.roles = action.payload?.roles || [];
  state.permissions = action.payload?.permissions || [];
  state.brandSettings = action.payload?.brandSettings || null;
},
meFailure: (state, action) => {
  state.meLoading = false;
  state.meError = action.payload;
},

    // RESET
  resetPasswordRequest: (state) => {
  state.resetLoading = true;
  state.resetError = null;
  state.resetMessage = null;
  state.resetEmail = null;
},
resetPasswordSuccess: (state, action) => {
  state.resetLoading = false;
  state.resetMessage =
    action.payload?.message || action.payload || "Password reset successful";
  state.resetEmail = action.payload?.email || null;
},
resetPasswordFailure: (state, action) => {
  state.resetLoading = false;
  state.resetError = action.payload || "Reset password failed";
},
clearResetPasswordState: (state) => {
  state.resetLoading = false;
  state.resetError = null;
  state.resetMessage = null;
  state.resetEmail = null;
},

    // CHANGE PASSWORD
    changePasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    changePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload || "Password changed";
    },
    changePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Change password failed";
    },

    hydrateAuthRequest: (state) => {
  state.bootstrapping = true;
},

hydrateAuthSuccess: (state, action) => {
  state.bootstrapping = false;

  const p = action.payload;

  if (!p?.token) {
    // ✅ no token found => logged out state
    state.token = null;
    state.tokenType = "Bearer";
    state.expiresIn = null;
    state.tenant = null;

    state.user = null;
    state.roles = [];
    state.permissions = [];
    state.brandSettings = null;
    return;
  }

  state.token = p.token;
  state.tokenType = p.tokenType || "Bearer";
  state.expiresIn = p.expiresIn ?? null;
  state.tenant = p.tenant || null;

  state.user = p.user || null;
  state.roles = p.roles || [];
  state.permissions = p.permissions || [];
  state.brandSettings = p.brandSettings || null;
},


hydrateAuthFailure: (state) => {
  state.bootstrapping = false;
},


    // LOGOUT + UTIL
    logoutRequest: (state) => {
  // state.loading = true;
  state.error = null;
},
logoutSuccess: (state) => {
  // clear everything
  state.token = null;
  state.tokenType = "Bearer";
  state.expiresIn = null;
  state.tenant = null;

  state.user = null;
  state.roles = [];
  state.permissions = [];
  state.brandSettings = null;

  state.loading = false;
    state.bootstrapping = false; // ✅ safety
  state.error = null;
},
logoutFailure: (state, action) => {
  state.loading = false;
  state.error = action.payload || "Logout failed";
},
    clearAuthMessage: (state) => {
      state.message = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
    clearForgotPasswordState,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearResetPasswordState,

  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  meRequest,
  meSuccess,
  meFailure,
 logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearAuthMessage,
  clearAuthError,
   hydrateAuthRequest,
  hydrateAuthSuccess,
  hydrateAuthFailure,
} = authSlice.actions;

export default authSlice.reducer;
