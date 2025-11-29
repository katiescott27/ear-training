// src/audio/notes.ts

// --------------------
// Types
// --------------------

export interface NoteDef {
  name: string;   // label shown in UI (e.g., "C", "F#", "Bb")
  freq: number;   // frequency in Hz
}

// Extend this later: 'dorian' | 'mixolydian' | etc.
export type ScaleMode = 'major' | 'minor';

export interface ScaleDef {
  id: string;
  label: string;          // e.g. "C Major"
  mode: ScaleMode;        // "major" | "minor" (later dorian, mixolydian, etc.)
  tonic: string;          // e.g. "C", "G", "Bb"
  notes: NoteDef[];       // array of { name: "C", freq: 261.63 }
  accidentalCount: number; // number of sharps or flats in the key signature
}

// This is the static metadata that defines each key/scale.
// No octave or concrete notes baked in here – just the "idea" of the scale.
export interface ScaleSpec {
  id: string;            // "c-major"
  label: string;         // "C Major"
  tonic: string;         // "C", "G", "Bb", etc. (as shown in UI)
  mode: ScaleMode;       // "major" | "minor"
  accidentalCount: number;
  useFlats: boolean;     // true for flat keys, false for sharp keys
}

// --------------------
// Tuning + pitch maps
// --------------------

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

// Canonical labels for sharp / flat spellings
const INDEX_TO_LABEL_SHARP: string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];

const INDEX_TO_LABEL_FLAT: string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F',
  'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
];

// Map any label (sharp or flat spelling) to the pitch key
// used for frequency lookup.
const LABEL_TO_PITCH: Record<string, keyof typeof PITCH_INDEX> = {
  C: 'C',
  'C#': 'C#',
  Db: 'C#',
  D: 'D',
  'D#': 'D#',
  Eb: 'D#',
  E: 'E',
  F: 'F',
  'F#': 'F#',
  Gb: 'F#',
  G: 'G',
  'G#': 'G#',
  Ab: 'G#',
  A: 'A',
  'A#': 'A#',
  Bb: 'A#',
  B: 'B',
};

/**
 * Equal-temperament frequency: A4 = 440 Hz.
 */
function freq(
  noteName: keyof typeof PITCH_INDEX,
  octave: number,
): number {
  const pitchIndex = PITCH_INDEX[noteName];
  const midi = 12 * (octave + 1) + pitchIndex;
  const a4Midi = 69;
  const semitoneOffset = midi - a4Midi;
  const f = A4 * Math.pow(2, semitoneOffset / 12);
  return parseFloat(f.toFixed(2));
}

function note(
  label: string,
  pitchName: keyof typeof PITCH_INDEX,
  octave: number,
): NoteDef {
  return {
    name: label,
    freq: freq(pitchName, octave),
  };
}

// --------------------
// Mode interval tables
// --------------------

// Semitone offsets from the tonic, including the octave (12).
// These arrays all have length 8 (1–7 + octave).

const MODE_INTERVALS: Record<ScaleMode, number[]> = {
  // Ionian (major): 1 2 3 4 5 6 7 8
  // Steps: W W H W W W H
  major: [0, 2, 4, 5, 7, 9, 11, 12],

  // Aeolian (natural minor): 1 2 b3 4 5 b6 b7 8
  // Steps: W H W W H W W
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
};

// --------------------
// Scale metadata specs
// --------------------

// You can add more keys here easily, or add new modes later.
// By convention, if you don't pass a rootOctave, we'll build into 4 → 5.

const SCALE_SPECS: ScaleSpec[] = [
  // Major – natural & sharp keys
  {
    id: 'c-major',
    label: 'C Major',
    tonic: 'C',
    mode: 'major',
    accidentalCount: 0,
    useFlats: false,
  },
  {
    id: 'g-major',
    label: 'G Major',
    tonic: 'G',
    mode: 'major',
    accidentalCount: 1,
    useFlats: false,
  },
  {
    id: 'd-major',
    label: 'D Major',
    tonic: 'D',
    mode: 'major',
    accidentalCount: 2,
    useFlats: false,
  },
  {
    id: 'a-major',
    label: 'A Major',
    tonic: 'A',
    mode: 'major',
    accidentalCount: 3,
    useFlats: false,
  },
  {
    id: 'e-major',
    label: 'E Major',
    tonic: 'E',
    mode: 'major',
    accidentalCount: 4,
    useFlats: false,
  },
  {
    id: 'b-major',
    label: 'B Major',
    tonic: 'B',
    mode: 'major',
    accidentalCount: 5,
    useFlats: false,
  },
  {
    id: 'f-sharp-major',
    label: 'F# Major',
    tonic: 'F#',
    mode: 'major',
    accidentalCount: 6,
    useFlats: false,
  },
  {
    id: 'c-sharp-major',
    label: 'C# Major',
    tonic: 'C#',
    mode: 'major',
    accidentalCount: 7,
    useFlats: false,
  },

  // Major – flat keys
  {
    id: 'f-major',
    label: 'F Major',
    tonic: 'F',
    mode: 'major',
    accidentalCount: 1,
    useFlats: true,
  },
  {
    id: 'bb-major',
    label: 'Bb Major',
    tonic: 'Bb',
    mode: 'major',
    accidentalCount: 2,
    useFlats: true,
  },
  {
    id: 'eb-major',
    label: 'Eb Major',
    tonic: 'Eb',
    mode: 'major',
    accidentalCount: 3,
    useFlats: true,
  },
  {
    id: 'ab-major',
    label: 'Ab Major',
    tonic: 'Ab',
    mode: 'major',
    accidentalCount: 4,
    useFlats: true,
  },
  {
    id: 'db-major',
    label: 'Db Major',
    tonic: 'Db',
    mode: 'major',
    accidentalCount: 5,
    useFlats: true,
  },
  {
    id: 'gb-major',
    label: 'Gb Major',
    tonic: 'Gb',
    mode: 'major',
    accidentalCount: 6,
    useFlats: true,
  },

  // Minor – natural minor (Aeolian)
  {
    id: 'a-minor',
    label: 'A Minor',
    tonic: 'A',
    mode: 'minor',
    accidentalCount: 0, // relative to C
    useFlats: false,
  },
  {
    id: 'e-minor',
    label: 'E Minor',
    tonic: 'E',
    mode: 'minor',
    accidentalCount: 1, // relative to G
    useFlats: false,
  },
  {
    id: 'b-minor',
    label: 'B Minor',
    tonic: 'B',
    mode: 'minor',
    accidentalCount: 2, // relative to D
    useFlats: false,
  },
  {
    id: 'f-sharp-minor',
    label: 'F# Minor',
    tonic: 'F#',
    mode: 'minor',
    accidentalCount: 3, // relative to A
    useFlats: false,
  },
  {
    id: 'c-sharp-minor',
    label: 'C# Minor',
    tonic: 'C#',
    mode: 'minor',
    accidentalCount: 4, // relative to E
    useFlats: false,
  },
  {
    id: 'd-minor',
    label: 'D Minor',
    tonic: 'D',
    mode: 'minor',
    accidentalCount: 1, // relative to F
    useFlats: true,
  },
  {
    id: 'g-minor',
    label: 'G Minor',
    tonic: 'G',
    mode: 'minor',
    accidentalCount: 2, // relative to Bb
    useFlats: true,
  },
  {
    id: 'c-minor',
    label: 'C Minor',
    tonic: 'C',
    mode: 'minor',
    accidentalCount: 3, // relative to Eb
    useFlats: true,
  },
];

// --------------------
// Scale construction (core logic)
// --------------------

/**
 * Build a concrete scale (ScaleDef) from a ScaleSpec:
 * - Uses the mode's interval pattern (major / natural minor)
 * - Uses sharp or flat spellings depending on useFlats
 * - Places tonic in the specified rootOctave (default = 4),
 *   with the octave tonic in rootOctave + 1.
 */
function buildScaleFromSpec(
  spec: ScaleSpec,
  rootOctave: number = 4,
): ScaleDef {
  const intervals = MODE_INTERVALS[spec.mode];

  const tonicPitchName = LABEL_TO_PITCH[spec.tonic];
  const tonicIndex = PITCH_INDEX[tonicPitchName];

  const labelTable = spec.useFlats
    ? INDEX_TO_LABEL_FLAT
    : INDEX_TO_LABEL_SHARP;

  const startingOctave = rootOctave;

  const notes: NoteDef[] = intervals.map((offset, degree) => {
    const pitchIndex = (tonicIndex + offset) % 12;
    const label = labelTable[pitchIndex];
    const pitchName = LABEL_TO_PITCH[label];
    const octave =
      pitchIndex < tonicIndex || degree === 7
        ? startingOctave + 1
        : startingOctave;

    return note(label, pitchName, octave);
  });

  return {
    id: spec.id,
    label: spec.label,
    mode: spec.mode,
    tonic: spec.tonic,
    notes,
    accidentalCount: spec.accidentalCount,
  };
}

// --------------------
// Public API for UI + playback
// --------------------

/**
 * Return all scale specs (metadata) for populating dropdowns, filters, etc.
 * These DO NOT include concrete notes or octave info.
 */
export function getAllScaleSpecs(): readonly ScaleSpec[] {
  return SCALE_SPECS;
}

/**
 * Look up a single ScaleSpec by id.
 */
export function getScaleSpecById(id: string): ScaleSpec | undefined {
  return SCALE_SPECS.find(s => s.id === id);
}

/**
 * Build a concrete ScaleDef at a specific root octave, e.g. 3, 4, 5.
 * Use this when you actually want to PLAY the scale.
 */
export function buildScaleAtOctave(
  id: string,
  rootOctave: number,
): ScaleDef {
  const spec = getScaleSpecById(id) ?? SCALE_SPECS[0];
  return buildScaleFromSpec(spec, rootOctave);
}
