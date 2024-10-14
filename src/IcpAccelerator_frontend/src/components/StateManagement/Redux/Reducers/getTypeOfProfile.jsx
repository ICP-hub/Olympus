import { createSlice } from '@reduxjs/toolkit';

const initialTypeOfProfile = {
  profiles: [],
  loading: false,
  error: null,
};

const typeOfProfileSlice = createSlice({
  name: 'profileTypes',
  initialState: initialTypeOfProfile,
  reducers: {
    typeOfProfileSliceHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    typeOfProfileSliceHandlerSuccess: (state, action) => {
      state.loading = false;
      state.profiles = action.payload;
    },
    typeOfProfileSliceHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  typeOfProfileSliceHandlerRequest,
  typeOfProfileSliceHandlerSuccess,
  typeOfProfileSliceHandlerFailure,
} = typeOfProfileSlice.actions;

export default typeOfProfileSlice.reducer;
