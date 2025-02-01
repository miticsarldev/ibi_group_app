import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;