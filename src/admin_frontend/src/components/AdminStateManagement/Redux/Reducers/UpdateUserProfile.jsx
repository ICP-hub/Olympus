import { createSlice } from "@reduxjs/toolkit";

const initialUpdateUserProfiletate = {
  update_Profile: 0,
  loading: false,
  error: null,
};
const updateUserProfileSlice = createSlice({
  name: "updateUserProfile",
  initialState: initialUpdateUserProfiletate,
  reducers: {
    checkUpdateUserProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserProfileSuccess: (state, action) => {
      // console.log("updateUserProfileSuccess run =>", action.payload);
      state.update_Profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserProfileFailure: (state, action) => {
      // console.log("updateUserProfileFailure run =>", action);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateUserProfileFailure,
  updateUserProfileSuccess,
  checkUpdateUserProfileStart,
} = updateUserProfileSlice.actions;

export default updateUserProfileSlice.reducer;
