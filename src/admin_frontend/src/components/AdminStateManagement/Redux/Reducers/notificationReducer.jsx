import { createSlice } from "@reduxjs/toolkit";

const initialHubState = {
  data: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialHubState,
  reducers: {
    notificationHandlerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    notificationHandlerSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    notificationHandlerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  notificationHandlerFailure,
  notificationHandlerRequest,
  notificationHandlerSuccess,
} = notificationSlice.actions;

export default notificationSlice.reducer;
