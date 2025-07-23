import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { id, name, role }
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
