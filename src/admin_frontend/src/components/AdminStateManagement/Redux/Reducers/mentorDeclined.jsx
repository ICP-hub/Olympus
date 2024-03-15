import { createSlice } from "@reduxjs/toolkit";

const initialMentorDeclinedState = {
  data: [],
  loading: false,
  error: null,
};

const mentorDeclinedSlice = createSlice({
  name: "mentorDeclined",
  initialState: initialMentorDeclinedState,
  reducers: {
    mentorDeclinedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    mentorDeclinedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    mentorDeclinedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  mentorDeclinedFailure,
  mentorDeclinedRequest,
  mentorDeclinedSuccess,
} = mentorDeclinedSlice.actions;

export default mentorDeclinedSlice.reducer;
