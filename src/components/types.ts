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

// "any" or an exact accidental count in the key signature
export type AccidentalFilter = 'any' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
