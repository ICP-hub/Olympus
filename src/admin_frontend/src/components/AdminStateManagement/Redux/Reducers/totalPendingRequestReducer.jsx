import { createSlice } from "@reduxjs/toolkit";

const initialTotalPendingState = {
  total_Pending: 10,
  loading: false,
  error: null,
};

const totalPendingSlice = createSlice({
  name: "totalPending",
  initialState: initialTotalPendingState,
  reducers: {
    checkTotalPendingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalPendingSuccess: (state, action) => {
      // console.log("totalPendingSuccess run =>", action.payload);
      state.total_Pending = action.payload;
      state.loading = false;
      state.error = null;
    },
    totalPendingFailure: (state, action) => {
      // console.log("totalPendingFailure run =>", action);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  totalPendingFailure,
  totalPendingSuccess,
  checkTotalPendingStart,
} = totalPendingSlice.actions;

export default totalPendingSlice.reducer;
