// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';

import { uiReducer } from './uiSlice';
import { coreReducer } from './coreSlice';
import { noteGuessReducer } from './noteGuessSlice';
import { intervalReducer } from './intervalSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    core: coreReducer,
    noteGuess: noteGuessReducer,
    interval: intervalReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
