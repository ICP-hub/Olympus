import { createSlice } from "@reduxjs/toolkit";

const initialCountState = {
  mentor_count: 0,
  vc_count: 0,
  project_count: 0,
  total_user: 0,
  only_user: 0,
  loading: false,
  error: null,
};

const CountSlice = createSlice({
  name: "count",
  initialState: initialCountState,
  reducers: {
    checkCountStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    countSuccess: (state, action) => {
      // console.log("countSuccess run =>", action.payload);
      const { mentor_count, vc_count, project_count, user_count, only_user_count } =
        action.payload;
      state.mentor_count = mentor_count;
      state.vc_count = vc_count;
      state.project_count = project_count;
      state.total_user = user_count;
      state.only_user = only_user_count;
      state.loading = false;
      state.error = null;
    },
    countFailure: (state, action) => {
      // console.log("countFailure run =>", action);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  checkCountStart,
  countSuccess,
  countFailure,
} = CountSlice.actions;

export default CountSlice.reducer;
