import { createSlice } from "@reduxjs/toolkit";

const initialMentorApprovedState = {
  data: [],
  loading: false,
  error: null,
};

const mentorApprovedSlice = createSlice({
  name: "mentorApproved",
  initialState: initialMentorApprovedState,
  reducers: {
    mentorApprovedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    mentorApprovedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.profiles;
      state.count = action.payload.count;
    },
    mentorApprovedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  mentorApprovedFailure,
  mentorApprovedRequest,
  mentorApprovedSuccess,
} = mentorApprovedSlice.actions;

export default mentorApprovedSlice.reducer;
