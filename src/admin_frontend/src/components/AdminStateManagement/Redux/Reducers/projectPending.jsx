import { createSlice } from "@reduxjs/toolkit";

const initialProjectPendingState = {
  data: [],
  loading: false,
  error: null,
};

const projectPendingSlice = createSlice({
  name: "projectPending",
  initialState: initialProjectPendingState,
  reducers: {
    projectPendingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    projectPendingSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    projectPendingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  projectPendingFailure,
  projectPendingRequest,
  projectPendingSuccess,
} = projectPendingSlice.actions;

export default projectPendingSlice.reducer;
