// src/components/types.ts

export interface ResultState {
  correct: boolean;
  played: string;
  guess: string;
}

export interface ScoreState {
  correct: number;
  total: number;
}

export interface Attempt {
  id: number;
  ts: number;
  played: string;
  guess: string;
  correct: boolean;
}
