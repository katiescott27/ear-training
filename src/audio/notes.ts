// src/audio/notes.ts

export interface NoteDef {
  name: string;
  freq: number;
}

// C4–B4 (middle C major scale)
export const NOTES: NoteDef[] = [
  { name: 'C', freq: 261.63 },
  { name: 'D', freq: 293.66 },
  { name: 'E', freq: 329.63 },
  { name: 'F', freq: 349.23 },
  { name: 'G', freq: 392.0 },
  { name: 'A', freq: 440.0 },
  { name: 'B', freq: 493.88 },
];
