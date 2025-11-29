// src/store/trainerSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ResultState,
  ScoreState,
  Attempt,
} from '../components/types';

export interface TrainerState {
  // selection
  selectedScaleId: string;
  selectedOctave: number | null;

  // current round
  currentNoteName: string | null;
  lastResult: ResultState | null;

  // stats + history
  score: ScoreState;
  history: Attempt[];
  nextId: number;
}

const initialState: TrainerState = {
  selectedScaleId: '',
  selectedOctave: null,

  currentNoteName: null,
  lastResult: null,

  score: {
    correct: 0,
    total: 0,
  },
  history: [],
  nextId: 1,
};

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    setScaleId(state, action: PayloadAction<string>) {
      state.selectedScaleId = action.payload;
      // changing the scale resets the current round result
      state.currentNoteName = null;
      state.lastResult = null;
    },
    setOctave(state, action: PayloadAction<number | null>) {
      state.selectedOctave = action.payload;
      // changing octave resets the current round result
      state.currentNoteName = null;
      state.lastResult = null;
    },
    startNewRound(state, action: PayloadAction<{ noteName: string }>) {
      state.currentNoteName = action.payload.noteName;
      state.lastResult = null;
    },
    clearCurrentNote(state) {
      state.currentNoteName = null;
    },
    recordAttempt(
      state,
      action: PayloadAction<{
        played: string;
        guess: string;
        correct: boolean;
        ts: number;
      }>,
    ) {
      const { played, guess, correct, ts } = action.payload;

      const attempt: Attempt = {
        id: state.nextId,
        ts,
        played,
        guess,
        correct,
      };

      state.history = [attempt, ...state.history];
      state.nextId += 1;

      state.score = {
        correct: state.score.correct + (correct ? 1 : 0),
        total: state.score.total + 1,
      };

      state.lastResult = {
        correct,
        played,
        guess,
      };
    },
    clearHistory(state) {
      state.history = [];
      state.score = { correct: 0, total: 0 };
      state.lastResult = null;
    },
  },
});

export const {
  setScaleId,
  setOctave,
  startNewRound,
  clearCurrentNote,
  recordAttempt,
  clearHistory,
} = trainerSlice.actions;

export default trainerSlice.reducer;
