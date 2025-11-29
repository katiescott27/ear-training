// src/store/intervalSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ResultState,
  ScoreState,
  Attempt,
} from '../components/types';

export interface IntervalState {
  firstNoteName: string | null;
  secondNoteName: string | null;
  lastResult: ResultState | null;
  score: ScoreState;
  history: Attempt[];
  nextId: number;
}

const initialState: IntervalState = {
  firstNoteName: null,
  secondNoteName: null,
  lastResult: null,
  score: {
    correct: 0,
    total: 0,
  },
  history: [],
  nextId: 1,
};

const intervalSlice = createSlice({
  name: 'interval',
  initialState,
  reducers: {
    startNewRound(
      state,
      action: PayloadAction<{
        firstNoteName: string;
        secondNoteName: string;
      }>,
    ) {
      state.firstNoteName = action.payload.firstNoteName;
      state.secondNoteName = action.payload.secondNoteName;
      state.lastResult = null;
    },
    clearIntervalNotes(state) {
      state.firstNoteName = null;
      state.secondNoteName = null;
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
      state.firstNoteName = null;
      state.secondNoteName = null;
    },
  },
});

export const {
  startNewRound,
  clearIntervalNotes,
  recordAttempt,
  clearHistory,
} = intervalSlice.actions;

export const intervalReducer = intervalSlice.reducer;
export default intervalReducer;
