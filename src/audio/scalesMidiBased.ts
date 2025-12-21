// src/audio/scalesMidiBased.ts

import type { NoteDef } from './notesMidiBased';
import { createNote } from './notesMidiBased';

// --------------------
// Types
// --------------------

// 0..11 where 0=C, 1=C#, ... 11=B
export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type ScaleId =
  | 'major'
  | 'minor'
  | 'major_pentatonic'
  | 'minor_pentatonic'
  | 'blues';

// --------------------
// Scale patterns
// --------------------
// Offsets from root, includes octave (12) at the end.
export const SCALE_PATTERNS: Record<ScaleId, readonly number[]> = {
  major:            [0, 2, 4, 5, 7, 9, 11, 12],
  minor:            [0, 2, 3, 5, 7, 8, 10, 12],
  major_pentatonic: [0, 2, 4, 7, 9, 12],
  minor_pentatonic: [0, 3, 5, 7, 10, 12],
  blues:            [0, 3, 5, 6, 7, 10, 12],
} as const;

// --------------------
// Helpers
// --------------------
export function clampMidi(midi: number): number {
  return Math.max(0, Math.min(127, midi));
}

/**
 * MIDI octave convention:
 * C4 = 60 => octaveFromMidi(60) == 4 (as you implemented)
 * So base formula is: midi = (octave + 1) * 12 + pitchClass
 */
export function midiFromPitchClassOctave(pc: PitchClass, octave: number): number {
  return (octave + 1) * 12 + pc;
}

/**
 * Build a scale as MIDI numbers from a root MIDI note and a scale pattern.
 */
export function buildScaleMidiFromRoot(
  rootMidi: number,
  scaleId: ScaleId,
  options?: {
    includeOctave?: boolean; // include the top octave note (12)
    clampRange?: boolean;    // clamp each midi to [0..127]
  }
): number[] {
  const { includeOctave = true, clampRange = false } = options ?? {};

  const pattern = SCALE_PATTERNS[scaleId];
  const offsets = includeOctave ? pattern : pattern.slice(0, -1);

  const midis = offsets.map((o) => rootMidi + o);
  return clampRange ? midis.map(clampMidi) : midis;
}

/**
 * Build a scale as MIDI numbers given pitch class + octave (tonic definition).
 */
export function buildScaleMidiAtOctave(
  tonicPc: PitchClass,
  octave: number,
  scaleId: ScaleId,
  options?: {
    includeOctave?: boolean;
    clampRange?: boolean;
  }
): number[] {
  const rootMidi = midiFromPitchClassOctave(tonicPc, octave);
  return buildScaleMidiFromRoot(rootMidi, scaleId, options);
}

/**
 * Build a scale as NoteDef[] (UI-friendly) using your createNote factory.
 */
export function buildScaleNotesAtOctave(
  tonicPc: PitchClass,
  octave: number,
  scaleId: ScaleId,
  options?: {
    useFlats?: boolean;      // label spelling
    includeOctave?: boolean; // include the top octave note (12)
    clampRange?: boolean;    // clamp midi to [0..127]
  }
): NoteDef[] {
  const { useFlats = false, includeOctave = true, clampRange = false } = options ?? {};

  const midis = buildScaleMidiAtOctave(tonicPc, octave, scaleId, {
    includeOctave,
    clampRange,
  });

  return midis.map((m) => createNote(m, { useFlats, clampRange }));
}
