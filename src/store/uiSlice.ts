// src/store/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type GameId = 'noteGuess' | 'intervalTrainer';

interface UiState {
  activeGameId: GameId | null;   // null = show main menu
  isSelectingScale: boolean;     // true = show full ScaleSelector screen
}

const initialState: UiState = {
  activeGameId: null,
  isSelectingScale: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectGame(state, action: PayloadAction<GameId>) {
      state.activeGameId = action.payload;
      state.isSelectingScale = false;
    },
    backToMenu(state) {
      state.activeGameId = null;
      state.isSelectingScale = false;
    },
    openScaleSelector(state) {
      state.isSelectingScale = true;
    },
    closeScaleSelector(state) {
      state.isSelectingScale = false;
    },
  },
});

export const {
  selectGame,
  backToMenu,
  openScaleSelector,
  closeScaleSelector,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
export default uiReducer;
