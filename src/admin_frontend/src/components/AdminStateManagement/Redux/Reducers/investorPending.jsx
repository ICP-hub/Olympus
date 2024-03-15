import { createSlice } from "@reduxjs/toolkit";

const initialInvestorPendingState = {
  data: [],
  loading: false,
  error: null,
};

const investorPendingSlice = createSlice({
  name: "investorPending",
  initialState: initialInvestorPendingState,
  reducers: {
    investorPendingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    investorPendingSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    investorPendingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  investorPendingFailure,
  investorPendingRequest,
  investorPendingSuccess,
} = investorPendingSlice.actions;

export default investorPendingSlice.reducer;
