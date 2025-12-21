// src/audio/notes.ts

// --------------------
// Constants
// --------------------
const A4_MIDI = 69;
const A4_FREQ = 440;

// Canonical labels for sharp / flat spellings
const INDEX_TO_LABEL_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;
const INDEX_TO_LABEL_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'] as const;

// --------------------
// Types
// --------------------
export interface NoteDef {
  midi: number;   // unique identity for a note
  freq: number;   // frequency in Hz derived from midi
  octave: number; // derived from midi - 4, 5, etc.
  label: string;  // label shown in UI (e.g., "C", "F#", "Bb")
}

// --------------------
// Helper Functions
// --------------------
export function midiToFreq(midi: number): number {
  const freq = A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
  return parseFloat(freq.toFixed(2));
}

export function pitchClassFromMidi(midi: number, useFlats: boolean): string {
  const pc = ((midi % 12) + 12) % 12;
  return (useFlats ? INDEX_TO_LABEL_FLAT : INDEX_TO_LABEL_SHARP)[pc];
}

export function octaveFromMidi(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

// --------------------
// Note Factory
// --------------------
export function createNote(
  midi: number,
  options?: {
    useFlats?: boolean;
    clampRange?: boolean;
  }
): NoteDef {
  const { useFlats = false, clampRange = false } = options ?? {};

  let safeMidi = midi;

  // Optional safety (useful later for UI / piano range)
  if (clampRange) {
    safeMidi = Math.max(0, Math.min(127, midi));
  }

  return {
    midi: safeMidi,
    freq: midiToFreq(safeMidi),
    octave: octaveFromMidi(safeMidi),
    label: pitchClassFromMidi(safeMidi, useFlats),
  };
}