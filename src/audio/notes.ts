// src/audio/notes.ts

export interface NoteDef {
  name: string;
  freq: number;
}

export interface ScaleDef {
  id: string;
  label: string;
  notes: NoteDef[];
}

// C major: C4–B4 (middle C scale)
const C_MAJOR_NOTES: NoteDef[] = [
  { name: 'C', freq: 261.63 },  // C4
  { name: 'D', freq: 293.66 },  // D4
  { name: 'E', freq: 329.63 },  // E4
  { name: 'F', freq: 349.23 },  // F4
  { name: 'G', freq: 392.0 },   // G4
  { name: 'A', freq: 440.0 },   // A4
  { name: 'B', freq: 493.88 },  // B4
  { name: 'C', freq: 523.25 },  // C5
];

// A natural minor: A3–A4 ascending
// A3, B3, C4, D4, E4, F4, G4, A4
const A_MINOR_NOTES: NoteDef[] = [
  { name: 'A', freq: 220.0 },    // A3
  { name: 'B', freq: 246.94 },   // B3
  { name: 'C', freq: 261.63 },   // C4
  { name: 'D', freq: 293.66 },   // D4
  { name: 'E', freq: 329.63 },   // E4
  { name: 'F', freq: 349.23 },   // F4
  { name: 'G', freq: 392.0 },    // G4
  { name: 'A', freq: 440.0 },    // A4
];

export const SCALES: ScaleDef[] = [
  {
    id: 'c-major',
    label: 'C Major (C4–B4)',
    notes: C_MAJOR_NOTES,
  },
  {
    id: 'a-minor',
    label: 'A Minor (A3–A4)',
    notes: A_MINOR_NOTES,
  },
];

export function getScaleById(id: string): ScaleDef {
  const scale = SCALES.find(s => s.id === id);
  if (!scale) {
    return SCALES[0]; // default to C major
  }
  return scale;
}
