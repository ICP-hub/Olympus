import { createSlice } from "@reduxjs/toolkit";

const initialUserRole = {
  specificRole: null,
  loading: false,
  error: null,
};

const userRoleSlice = createSlice({
  name: "currentRole",
  initialState: initialUserRole,
  reducers: {
    userRoleHandler: (state) => {
      state.loading = true;
      state.error = null;
    },
    userRoleSuccessHandler: (state, action) => {
      // console.log('specificRole in reducer =>',action.payload)
      state.loading = false;
      state.specificRole = action.payload;
    },
    userRoleFailureHandler: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  userRoleHandler,
  userRoleFailureHandler,
  userRoleSuccessHandler,
} = userRoleSlice.actions;

export default userRoleSlice.reducer;
