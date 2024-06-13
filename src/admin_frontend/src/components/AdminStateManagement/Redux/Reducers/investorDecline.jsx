import { createSlice } from "@reduxjs/toolkit";

const initialInvestorDeclinedState = {
  data: [],
  loading: false,
  error: null,
};

const investorDeclinedSlice = createSlice({
  name: "investorDeclined",
  initialState: initialInvestorDeclinedState,
  reducers: {
    investorDeclinedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    investorDeclinedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload.profiles;
      state.count = action.payload.count;
    },
    investorDeclinedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  investorDeclinedFailure,
  investorDeclinedRequest,
  investorDeclinedSuccess,
} = investorDeclinedSlice.actions;

export default investorDeclinedSlice.reducer;
