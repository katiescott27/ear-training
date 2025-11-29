// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import trainerReducer from './trainerSlice';

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
