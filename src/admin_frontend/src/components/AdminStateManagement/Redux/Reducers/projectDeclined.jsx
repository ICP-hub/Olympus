import { createSlice } from "@reduxjs/toolkit";

const initialProjectDeclinedState = {
  data: [],
  loading: false,
  error: null,
};

const projectDeclinedSlice = createSlice({
  name: "projectDeclined",
  initialState: initialProjectDeclinedState,
  reducers: {
    projectDeclinedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    projectDeclinedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    projectDeclinedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  projectDeclinedFailure,
  projectDeclinedRequest,
  projectDeclinedSuccess,
} = projectDeclinedSlice.actions;

export default projectDeclinedSlice.reducer;
