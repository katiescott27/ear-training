// src/store/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type GameId = 'noteGuess' | 'intervalTrainer';

interface UiState {
  activeGameId: GameId | null; // null = show main menu
}

const initialState: UiState = {
  activeGameId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectGame(state, action: PayloadAction<GameId>) {
      state.activeGameId = action.payload;
    },
    backToMenu(state) {
      state.activeGameId = null;
    },
  },
});

export const { selectGame, backToMenu } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
