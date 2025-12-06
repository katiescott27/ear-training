// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';

import { uiReducer } from './uiSlice';
import { coreReducer } from './coreSlice';
import { noteTrainerReducer } from './noteTrainerSlice';
import { intervalTrainerReducer } from './intervalTrainerSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    core: coreReducer,
    noteTrainer: noteTrainerReducer,
    intervalTrainer: intervalTrainerReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
