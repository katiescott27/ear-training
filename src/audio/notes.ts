// src/audio/notes.ts

export interface NoteDef {
  name: string;  // label shown in UI (e.g., "C", "F#", "Bb")
  freq: number;  // frequency in Hz
}

export type ScaleMode = 'major' | 'minor';

export interface ScaleDef {
  id: string;
  label: string;
  mode: ScaleMode;
  notes: NoteDef[];
}

// --- Frequency helpers (equal temperament, A4 = 440 Hz) ---

const A4 = 440;

const PITCH_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};

/**
 * Compute frequency for a note in equal temperament.
 * noteName: like "C", "F#", "A", etc.
 * octave: integer like 3, 4, 5 (C4 ~ middle C).
 */
function freq(noteName: keyof typeof PITCH_INDEX, octave: number): number {
  const pitchIndex = PITCH_INDEX[noteName];
  const midi = 12 * (octave + 1) + pitchIndex; // MIDI note number
  const a4Midi = 69;
  const semitoneOffset = midi - a4Midi;
  const f = A4 * Math.pow(2, semitoneOffset / 12);
  return parseFloat(f.toFixed(2));
}

/**
 * Convenience helper to create a NoteDef.
 * label: what the user sees on the button ("C", "F#", "Bb", etc.)
 * noteName: the pitch (for frequency), e.g., "C", "F#", "A#" (matching PITCH_INDEX keys)
 * octave: integer
 */
function note(label: string, noteName: keyof typeof PITCH_INDEX, octave: number): NoteDef {
  return {
    name: label,
    freq: freq(noteName, octave),
  };
}

// --- Major scales (one-octave, root to root) ---

// C Major: C4–C5
const C_MAJOR_NOTES: NoteDef[] = [
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F', 'F', 4),
  note('G', 'G', 4),
  note('A', 'A', 4),
  note('B', 'B', 4),
  note('C', 'C', 5),
];

// G Major: G3–G4 (F#)
const G_MAJOR_NOTES: NoteDef[] = [
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F#', 'F#', 4),
  note('G', 'G', 4),
];

// D Major: D3–D4 (F#, C#)
const D_MAJOR_NOTES: NoteDef[] = [
  note('D', 'D', 3),
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C#', 'C#', 4),
  note('D', 'D', 4),
];

// A Major: A3–A4 (F#, C#, G#)
const A_MAJOR_NOTES: NoteDef[] = [
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C#', 'C#', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F#', 'F#', 4),
  note('G#', 'G#', 4),
  note('A', 'A', 4),
];

// E Major: E3–E4 (F#, G#, C#, D#)
const E_MAJOR_NOTES: NoteDef[] = [
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G#', 'G#', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C#', 'C#', 4),
  note('D#', 'D#', 4),
  note('E', 'E', 4),
];

// B Major: B2–B3 (F#, C#, G#, D#, A#)
const B_MAJOR_NOTES: NoteDef[] = [
  note('B', 'B', 2),
  note('C#', 'C#', 3),
  note('D#', 'D#', 3),
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G#', 'G#', 3),
  note('A#', 'A#', 3),
  note('B', 'B', 3),
];

// F# Major: F#2–F#3
const F_SHARP_MAJOR_NOTES: NoteDef[] = [
  note('F#', 'F#', 2),
  note('G#', 'G#', 2),
  note('A#', 'A#', 2),
  note('B', 'B', 2),
  note('C#', 'C#', 3),
  note('D#', 'D#', 3),
  note('F', 'F', 3),   // enharmonic of E# (simplified)
  note('F#', 'F#', 3),
];

// C# Major: C#3–C#4 (simplified enharmonics)
const C_SHARP_MAJOR_NOTES: NoteDef[] = [
  note('C#', 'C#', 3),
  note('D#', 'D#', 3),
  note('F', 'F', 3),   // E#
  note('F#', 'F#', 3),
  note('G#', 'G#', 3),
  note('A#', 'A#', 3),
  note('C', 'C', 4),   // B#
  note('C#', 'C#', 4),
];

// F Major: F3–F4 (Bb)
const F_MAJOR_NOTES: NoteDef[] = [
  note('F', 'F', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F', 'F', 4),
];

// Bb Major: Bb2–Bb3 (Bb, Eb)
const B_FLAT_MAJOR_NOTES: NoteDef[] = [
  note('Bb', 'A#', 2),
  note('C', 'C', 3),
  note('D', 'D', 3),
  note('Eb', 'D#', 3),
  note('F', 'F', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('Bb', 'A#', 3),
];

// Eb Major: Eb3–Eb4 (Bb, Eb, Ab)
const E_FLAT_MAJOR_NOTES: NoteDef[] = [
  note('Eb', 'D#', 3),
  note('F', 'F', 3),
  note('G', 'G', 3),
  note('Ab', 'G#', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('Eb', 'D#', 4),
];

// Ab Major: Ab3–Ab4
const A_FLAT_MAJOR_NOTES: NoteDef[] = [
  note('Ab', 'G#', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('Db', 'C#', 4),
  note('Eb', 'D#', 4),
  note('F', 'F', 4),
  note('G', 'G', 4),
  note('Ab', 'G#', 4),
];

// Db Major: Db3–Db4
const D_FLAT_MAJOR_NOTES: NoteDef[] = [
  note('Db', 'C#', 3),
  note('Eb', 'D#', 3),
  note('F', 'F', 3),
  note('Gb', 'F#', 3),
  note('Ab', 'G#', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('Db', 'C#', 4),
];

// Gb Major: Gb2–Gb3
const G_FLAT_MAJOR_NOTES: NoteDef[] = [
  note('Gb', 'F#', 2),
  note('Ab', 'G#', 2),
  note('Bb', 'A#', 2),
  note('Cb', 'B', 2),
  note('Db', 'C#', 3),
  note('Eb', 'D#', 3),
  note('F', 'F', 3),
  note('Gb', 'F#', 3),
];

// --- Natural Minor Scales ---

const A_MINOR_NOTES: NoteDef[] = [
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F', 'F', 4),
  note('G', 'G', 4),
  note('A', 'A', 4),
];

// E natural minor (relative to G major): E F# G A B C D E
const E_MINOR_NOTES: NoteDef[] = [
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
];

// B natural minor (relative to D major): B C# D E F# G A B
const B_MINOR_NOTES: NoteDef[] = [
  note('B', 'B', 2),
  note('C#', 'C#', 3),
  note('D', 'D', 3),
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
];

// F# natural minor (relative to A major): F# G# A B C# D E F#
const F_SHARP_MINOR_NOTES: NoteDef[] = [
  note('F#', 'F#', 3),
  note('G#', 'G#', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C#', 'C#', 4),
  note('D', 'D', 4),
  note('E', 'E', 4),
  note('F#', 'F#', 4),
];

// C# natural minor (relative to E major): C# D# E F# G# A B C#
const C_SHARP_MINOR_NOTES: NoteDef[] = [
  note('C#', 'C#', 3),
  note('D#', 'D#', 3),
  note('E', 'E', 3),
  note('F#', 'F#', 3),
  note('G#', 'G#', 3),
  note('A', 'A', 3),
  note('B', 'B', 3),
  note('C#', 'C#', 4),
];

// D natural minor (relative to F major): D E F G A Bb C D
const D_MINOR_NOTES: NoteDef[] = [
  note('D', 'D', 3),
  note('E', 'E', 3),
  note('F', 'F', 3),
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
];

// G natural minor (relative to Bb major): G A Bb C D Eb F G
const G_MINOR_NOTES: NoteDef[] = [
  note('G', 'G', 3),
  note('A', 'A', 3),
  note('Bb', 'A#', 3),
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('Eb', 'D#', 4),
  note('F', 'F', 4),
  note('G', 'G', 4),
];

// C natural minor (relative to Eb major): C D Eb F G Ab Bb C
const C_MINOR_NOTES: NoteDef[] = [
  note('C', 'C', 4),
  note('D', 'D', 4),
  note('Eb', 'D#', 4),
  note('F', 'F', 4),
  note('G', 'G', 4),
  note('Ab', 'G#', 4),
  note('Bb', 'A#', 4),
  note('C', 'C', 5),
];

// --- Exported scales list ---

export const SCALES: ScaleDef[] = [
  // Major – natural & sharp keys
  { id: 'c-major', label: 'C Major', mode: 'major', notes: C_MAJOR_NOTES },
  { id: 'g-major', label: 'G Major', mode: 'major', notes: G_MAJOR_NOTES },
  { id: 'd-major', label: 'D Major', mode: 'major', notes: D_MAJOR_NOTES },
  { id: 'a-major', label: 'A Major', mode: 'major', notes: A_MAJOR_NOTES },
  { id: 'e-major', label: 'E Major', mode: 'major', notes: E_MAJOR_NOTES },
  { id: 'b-major', label: 'B Major', mode: 'major', notes: B_MAJOR_NOTES },
  { id: 'f-sharp-major', label: 'F# Major', mode: 'major', notes: F_SHARP_MAJOR_NOTES },
  { id: 'c-sharp-major', label: 'C# Major', mode: 'major', notes: C_SHARP_MAJOR_NOTES },

  // Major – flat keys
  { id: 'f-major', label: 'F Major', mode: 'major', notes: F_MAJOR_NOTES },
  { id: 'bb-major', label: 'Bb Major', mode: 'major', notes: B_FLAT_MAJOR_NOTES },
  { id: 'eb-major', label: 'Eb Major', mode: 'major', notes: E_FLAT_MAJOR_NOTES },
  { id: 'ab-major', label: 'Ab Major', mode: 'major', notes: A_FLAT_MAJOR_NOTES },
  { id: 'db-major', label: 'Db Major', mode: 'major', notes: D_FLAT_MAJOR_NOTES },
  { id: 'gb-major', label: 'Gb Major', mode: 'major', notes: G_FLAT_MAJOR_NOTES },

    // Minor (natural minor / Aeolian)
  { id: 'a-minor', label: 'A Minor', mode: 'minor', notes: A_MINOR_NOTES },
  { id: 'e-minor', label: 'E Minor', mode: 'minor', notes: E_MINOR_NOTES },
  { id: 'b-minor', label: 'B Minor', mode: 'minor', notes: B_MINOR_NOTES },
  { id: 'f-sharp-minor', label: 'F# Minor', mode: 'minor', notes: F_SHARP_MINOR_NOTES },
  { id: 'c-sharp-minor', label: 'C# Minor', mode: 'minor', notes: C_SHARP_MINOR_NOTES },
  { id: 'd-minor', label: 'D Minor', mode: 'minor', notes: D_MINOR_NOTES },
  { id: 'g-minor', label: 'G Minor', mode: 'minor', notes: G_MINOR_NOTES },
  { id: 'c-minor', label: 'C Minor', mode: 'minor', notes: C_MINOR_NOTES },
];

export function getScaleById(id: string): ScaleDef {
  const scale = SCALES.find(s => s.id === id);
  return scale ?? SCALES[0]; // default to C major
}
