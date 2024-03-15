import { createSlice } from "@reduxjs/toolkit";

const initialMentorPendingState = {
  data: [],
  loading: false,
  error: null,
};

const mentorPendingSlice = createSlice({
  name: "mentorPending",
  initialState: initialMentorPendingState,
  reducers: {
    mentorPendingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    mentorPendingSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    mentorPendingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  mentorPendingFailure,
  mentorPendingRequest,
  mentorPendingSuccess,
} = mentorPendingSlice.actions;

export default mentorPendingSlice.reducer;
