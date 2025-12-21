import { describe, it, expect } from 'vitest';
import { midiToFreq, pitchClassFromMidi, octaveFromMidi, createNote } from './notesMidiBased';


describe('midiToFreq', () => {
  it('returns A4 = 440.00 Hz for MIDI 69', () => {
    expect(midiToFreq(69)).toBe(440.0);
  });

  it('returns C4 ≈ 261.63 Hz for MIDI 60 (rounded to 2 decimals)', () => {
    expect(midiToFreq(60)).toBe(261.63);
  });

  it('returns A5 = 880.00 Hz for MIDI 81', () => {
    expect(midiToFreq(81)).toBe(880.0);
  });
});


describe('pitchClassFromMidi', () => {
  it('returns C for MIDI 60 (sharp labels)', () => {
    expect(pitchClassFromMidi(60, false)).toBe('C');
  });

  it('returns C# for MIDI 61 (sharp labels)', () => {
    expect(pitchClassFromMidi(61, false)).toBe('C#');
  });

  it('returns Db for MIDI 61 (flat labels)', () => {
    expect(pitchClassFromMidi(61, true)).toBe('Db');
  });

  it('handles negative MIDI values (wraps correctly)', () => {
    // -1 mod 12 should map to 11 => B
    expect(pitchClassFromMidi(-1, false)).toBe('B');
    expect(pitchClassFromMidi(-1, true)).toBe('B');
  });
});

describe('octaveFromMidi', () => {
  it('returns 4 for MIDI 60 (C4)', () => {
    expect(octaveFromMidi(60)).toBe(4);
  });

  it('returns 4 for MIDI 69 (A4)', () => {
    expect(octaveFromMidi(69)).toBe(4);
  });

  it('returns 5 for MIDI 72 (C5)', () => {
    expect(octaveFromMidi(72)).toBe(5);
  });

  it('returns -1 for MIDI 0 (C-1)', () => {
    expect(octaveFromMidi(0)).toBe(-1);
  });
});

describe('createNote', () => {
  it('creates C4 correctly from MIDI 60', () => {
    const note = createNote(60);

    expect(note).toEqual({
      midi: 60,
      freq: 261.63,
      octave: 4,
      label: 'C',
    });
  });

  it('creates Db4 when useFlats is true', () => {
    const note = createNote(61, { useFlats: true });

    expect(note.label).toBe('Db');
  });

  it('creates C#4 when useFlats is false', () => {
    const note = createNote(61);

    expect(note.label).toBe('C#');
  });
});