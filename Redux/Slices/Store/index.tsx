import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '@/Redux/Slices';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});
