// src/audio/scalesMidiBased.test.ts

import { describe, it, expect } from 'vitest';
import {
  midiFromPitchClassOctave,
  buildScaleMidiAtOctave,
  buildScaleNotesAtOctave,
  type PitchClass,
} from './scalesMidiBased';

// Pitch classes: 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B

describe('midiFromPitchClassOctave', () => {
  it('returns C4 = 60', () => {
    const C: PitchClass = 0;
    expect(midiFromPitchClassOctave(C, 4)).toBe(60);
  });

  it('returns D4 = 62', () => {
    const D: PitchClass = 2;
    expect(midiFromPitchClassOctave(D, 4)).toBe(62);
  });

  it('returns A4 = 69', () => {
    const A: PitchClass = 9;
    expect(midiFromPitchClassOctave(A, 4)).toBe(69);
  });
});

describe('buildScaleMidiAtOctave', () => {
  it('builds C major at octave 4', () => {
    const C: PitchClass = 0;
    expect(buildScaleMidiAtOctave(C, 4, 'major')).toEqual([60, 62, 64, 65, 67, 69, 71, 72]);
  });

  it('builds D major at octave 4', () => {
    const D: PitchClass = 2;
    expect(buildScaleMidiAtOctave(D, 4, 'major')).toEqual([62, 64, 66, 67, 69, 71, 73, 74]);
  });

  it('builds A natural minor at octave 4', () => {
    const A: PitchClass = 9;
    expect(buildScaleMidiAtOctave(A, 4, 'minor')).toEqual([69, 71, 72, 74, 76, 77, 79, 81]);
  });

  it('can exclude the top octave note', () => {
    const C: PitchClass = 0;
    expect(buildScaleMidiAtOctave(C, 4, 'major', { includeOctave: false })).toEqual([60, 62, 64, 65, 67, 69, 71]);
  });
});

describe('buildScaleNotesAtOctave', () => {
  it('returns NoteDef[] with correct midi + labels (C major, sharps)', () => {
    const C: PitchClass = 0;
    const notes = buildScaleNotesAtOctave(C, 4, 'major', { useFlats: false });

    expect(notes.map((n) => n.midi)).toEqual([60, 62, 64, 65, 67, 69, 71, 72]);
    expect(notes.map((n) => n.label)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']);
  });

  it('uses flats for labels when requested (Db major-ish root note labeling check)', () => {
    const Db: PitchClass = 1;
    const notes = buildScaleNotesAtOctave(Db, 4, 'major', { useFlats: true });

    // Just checking first label spelling preference here
    expect(notes[0].label).toBe('Db');
  });
});
