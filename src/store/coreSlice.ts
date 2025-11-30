// src/store/coreSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TrainerMode = 'singleNote' | 'interval';

export interface CoreState {
  mode: TrainerMode;
  selectedScaleId: string;
  selectedOctave: number | null;
}

const initialState: CoreState = {
  mode: 'singleNote',
  selectedScaleId: 'c-major',
  selectedOctave: 4,
};

const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<TrainerMode>) {
      state.mode = action.payload;
    },
    setScaleId(state, action: PayloadAction<string>) {
      state.selectedScaleId = action.payload;
    },
    setOctave(state, action: PayloadAction<number | null>) {
      state.selectedOctave = action.payload;
    },
  },
});

export const { setMode, setScaleId, setOctave } = coreSlice.actions;
export const coreReducer = coreSlice.reducer;
export default coreReducer;
