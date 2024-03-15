import { createSlice } from "@reduxjs/toolkit";

const initialProjectApprovedState = {
  data: [],
  loading: false,
  error: null,
};

const projectApprovedSlice = createSlice({
  name: "projectApproved",
  initialState: initialProjectApprovedState,
  reducers: {
    projectApprovedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    projectApprovedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    projectApprovedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  projectApprovedFailure,
  projectApprovedRequest,
  projectApprovedSuccess,
} = projectApprovedSlice.actions;

export default projectApprovedSlice.reducer;
