// src/store/noteGuessSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ResultState,
  ScoreState,
  Attempt,
} from '../components/types';

export interface NoteTrainerState {
  currentNoteName: string | null;
  lastResult: ResultState | null;
  score: ScoreState;
  history: Attempt[];
  nextId: number;
}

const initialState: NoteTrainerState = {
  currentNoteName: null,
  lastResult: null,
  score: {
    correct: 0,
    total: 0,
  },
  history: [],
  nextId: 1,
};

const noteTrainerSlice = createSlice({
  name: 'noteTrainer',
  initialState,
  reducers: {
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
      state.currentNoteName = null;
    },
  },
});

export const {
  startNewRound,
  clearCurrentNote,
  recordAttempt,
  clearHistory,
} = noteTrainerSlice.actions;

export const noteTrainerReducer = noteTrainerSlice.reducer;
export default noteTrainerReducer;
