import { createSlice } from '@reduxjs/toolkit';

const initialMentorState = {
  data: [],
  loading: false,
  error: null,
};

const mentorSlice = createSlice({
  name: 'mentoreData',
  initialState: initialMentorState,
  reducers: {
    mentorRegisteredHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    mentorRegisteredHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    mentorRegisteredHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  mentorRegisteredHandlerFailure,
  mentorRegisteredHandlerRequest,
  mentorRegisteredHandlerSuccess,
} = mentorSlice.actions;

export default mentorSlice.reducer;
