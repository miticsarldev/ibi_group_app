// store.js
import { configureStore } from '@reduxjs/toolkit';
import ratingReducer from '../slices/ratingslice';

export const store = configureStore({
  reducer: {
    rating: ratingReducer,
  },
});