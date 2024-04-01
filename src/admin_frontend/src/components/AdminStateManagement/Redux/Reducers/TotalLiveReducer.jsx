import { createSlice } from "@reduxjs/toolkit";

const initialTotalLivetate = {
  total_Live: 0,
  loading: false,
  error: null,
};
const totalLiveSlice = createSlice({
  name: "totalLive",
  initialState: initialTotalLivetate,
  reducers: {
    checkTotalLiveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    totalLiveSuccess: (state, action) => {
      // console.log("totalLiveSuccess run =>", action.payload);
      state.total_Live = action.payload;
      state.loading = false;
      state.error = null;
    },
    totalLiveFailure: (state, action) => {
      // console.log("totalLiveFailure run =>", action);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { totalLiveFailure, totalLiveSuccess, checkTotalLiveStart } =
  totalLiveSlice.actions;

export default totalLiveSlice.reducer;
