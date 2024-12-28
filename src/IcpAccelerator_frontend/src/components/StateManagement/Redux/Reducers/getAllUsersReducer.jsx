import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    currentPage: 1,
    hasMore: true,
    isFetching: false,
    error: null,
  },
  reducers: {
    fetchUsersRequest: (state, action) => {
      state.isFetching = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      const { users, currentPage, hasMore } = action.payload;
      state.isFetching = false;
      state.users = [...state.users, ...users];
      state.currentPage = currentPage;
      state.hasMore = hasMore;
    },
    fetchUsersFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    refreshUsers: (state, action) => {
      state.users = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  refreshUsers,
} = userSlice.actions;

export default userSlice.reducer;
