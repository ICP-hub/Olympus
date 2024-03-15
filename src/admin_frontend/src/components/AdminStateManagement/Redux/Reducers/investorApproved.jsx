import { createSlice } from "@reduxjs/toolkit";

const initialInvestorApprovedState = {
  data: [],
  loading: false,
  error: null,
};

const investorApprovedSlice = createSlice({
  name: "investorApproved",
  initialState: initialInvestorApprovedState,
  reducers: {
    investorApprovedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    investorApprovedSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    investorApprovedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  investorApprovedFailure,
  investorApprovedRequest,
  investorApprovedSuccess,
} = investorApprovedSlice.actions;

export default investorApprovedSlice.reducer;
