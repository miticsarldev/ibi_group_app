import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/redux/slices/userSlice';
import trajetReducer from '@/redux/slices/trajetSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    trajet: trajetReducer,
  },
});

// Définir le type RootState pour représenter l'état global
export type RootState = ReturnType<typeof store.getState>;
// Optionnellement, définissez AppDispatch si nécessaire
export type AppDispatch = typeof store.dispatch;

export default store;
