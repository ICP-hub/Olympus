import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  identity: null,
  principal: null,
  authClient: null,
  loading: false,
  error: null,
};

const internetIdentitySlice = createSlice({
  name: "internet",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;

      console.log('login start =>', state)
    },
    loginSuccess: (state, action) => {

      console.log("loginSuccess run =>", action)
      const { isAuthenticated, authClient, identity, principal } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.authClient = authClient;
      state.identity = identity;
      state.principal = principal;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      console.log("loginFailure run =>", action)

      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      console.log("logoutStart run =>", action)

      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      console.log("logoutSuccess run =>", action)

      state.isAuthenticated = false;
      state.authClient = null;
      state.identity = null;
      state.principal = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      console.log("logoutFailure run =>", action)

      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setAuthClient,
  loginStart,
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
} = internetIdentitySlice.actions;

export default internetIdentitySlice.reducer;
