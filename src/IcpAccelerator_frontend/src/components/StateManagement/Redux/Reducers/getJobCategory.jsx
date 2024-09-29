import { createSlice } from '@reduxjs/toolkit';

const initialJobCategoryState = {
  jobCategory: [],
  loading: false,
  error: null,
};

const jobCategorySlice = createSlice({
  name: 'jobCategory',
  initialState: initialJobCategoryState,
  reducers: {
    jobCategoryHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    jobCategoryHandlerSuccess: (state, action) => {
      state.loading = false;
      state.jobCategory = action.payload;
    },
    jobCategoryHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  jobCategoryHandlerFailure,
  jobCategoryHandlerRequest,
  jobCategoryHandlerSuccess,
} = jobCategorySlice.actions;

export default jobCategorySlice.reducer;
