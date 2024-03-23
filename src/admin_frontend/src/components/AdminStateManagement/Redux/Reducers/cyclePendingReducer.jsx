import { createSlice } from "@reduxjs/toolkit";

const initialCycleState = {
  cycles: 0,
  loading: false,
  error: null,
};

const CycleSlice = createSlice({
  name: "cycle",
  initialState: initialCycleState,
  reducers: {
    checkCycleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cycleSuccess: (state, action) => {
      // console.log("cycleSuccess run =>", action.payload);
      state.cycles = action.payload;
      state.loading = false;
      state.error = null;
    },
    cycleFailure: (state, action) => {
      // console.log("countFailure run =>", action);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  checkCycleStart,
  cycleSuccess,
  cycleFailure,
} = CycleSlice.actions;

export default CycleSlice.reducer;
