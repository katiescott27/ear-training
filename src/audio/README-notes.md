notes.ts – Musical Notes, Frequency Math, and Scale Construction

This file defines the musical pitch system used by the Ear Trainer app. It provides:

- A mapping from note names (C#4, Eb3, etc.) to accurate frequencies in Hz
- Definitions of major and minor scales
- Handling for sharp and flat key signatures
- A consistent tuning system based on MIDI, equal temperament, and A4 = 440 Hz

This document explains:
1. What a semitone is
2. What equal temperament means
3. How MIDI note numbers work
4. How the app computes frequencies
5. How scales are built
6. Why some scales are easier or harder
7. How sharps and flats are handled
8. Ideas for future expansion

## 1. Semitones – the basic unit of Western pitch

A semitone is the smallest standard step between two pitches in Western music. On a piano, it is the distance between any two adjacent keys. There are 12 semitones in an octave.

Major scales follow a fixed pattern of whole steps (2 semitones) and half steps (1 semitone):

Whole, Whole, Half, Whole, Whole, Whole, Half

Example: C major
C to D = whole (2)
D to E = whole
E to F = half
F to G = whole
G to A = whole
A to B = whole
B to C = half

All major keys follow this same pattern.

## 2. Equal Temperament (12-TET)

Equal temperament divides the octave (a doubling of frequency) into 12 equal steps. Each semitone multiplies the frequency by:

2^(1/12) ≈ 1.059463

This ensures that all keys work equally well without needing to retune an instrument. It is the tuning system used by:

- Piano
- Guitar (fret spacing uses 12-TET)
- Synthesizers
- Xylophones, marimbas
- Most digital instruments and all DAWs

The Ear Trainer app uses equal temperament because it matches the tuning of modern instruments.

## 3. MIDI and why it matters

MIDI (Musical Instrument Digital Interface) is not audio. It is a communication system describing musical events, such as:

- play note 60
- stop note 60
- change instrument
- apply pitch bend

In MIDI:
- Middle C = note 60
- A4 = note 69
- A4’s frequency = 440 Hz (the universal tuning reference)

The app uses MIDI-style numbering to compute frequencies for every note.

## 4. Frequency calculation in notes.ts

Step 1: Convert note name + octave to a MIDI-style index.
The code uses a pitch table (C = 0, C# = 1, ..., B = 11). The MIDI number is:

midi = 12 * (octave + 1) + pitchIndex

This matches MIDI’s convention:
- C4 is 60
- A4 is 69

Step 2: Convert MIDI index to frequency.
Using equal temperament and A4 = 440 Hz:

frequency = 440 * 2^((midi - 69) / 12)

This computes any pitch accurately. The result is rounded to 2 decimals.

## 5. Sharps, flats, and enharmonics

Notes like A# and Bb are enharmonic (same pitch, different names). The app handles this by distinguishing:

- label: what the user sees (Bb)
- pitch class: what is used for frequency math (A#)

Example:
note("Bb", "A#", 3)

This allows scales in flat keys to show flat note names while still using the same frequency system internally.

## 6. Scale definitions

Each scale in notes.ts contains:

- An id (like "c-major")
- A label (like "C Major")
- A mode: major or minor
- An array of NoteDef objects representing one octave, root to root

Example: F major (F3 to F4)
F, G, A, Bb, C, D, E, F

Example: A natural minor (A3 to A4)
A, B, C, D, E, F, G, A

Each scale follows the step pattern for its mode.

## 7. Difficulty of scales

All major scales follow the same pattern, but keys with fewer sharps or flats are considered easier.

Beginner-friendly keys (0–1 accidental):
- C major
- G major (1 sharp)
- F major (1 flat)
- A minor

Medium difficulty (2–3 accidentals):
- D major
- A major
- Bb major
- Eb major

Harder keys (4–7 accidentals):
- B major
- F# major
- C# major
- Gb major
- Db major

Keys with many accidentals are less familiar to most musicians and can be harder for beginners in ear training.

## 8. Range selection

Scales in notes.ts are defined in a comfortable mid-range where the ear identifies pitches most clearly:

- C major: C4 to C5
- G major: G3 to G4
- B major: B2 to B3
- Gb major: Gb2 to Gb3

Low notes can be muddy, and high notes can be piercing. Mid-range is ideal for ear training.

## 9. Future expansion ideas

This file can be extended in several ways:

- Additional minor scales (harmonic, melodic)
- Difficulty metadata in ScaleDef
- More modes (dorian, phrygian, lydian, mixolydian)
- Dynamic scale generation from formula patterns
- Utility functions for intervals, chords, and multi-octave patterns

## Summary

notes.ts is the core musical engine of the Ear Trainer app. It:

- Uses MIDI-style indexing
- Computes frequencies using equal temperament and A4 = 440 Hz
- Distinguishes note labels from pitch classes
- Defines major and minor scales in many keys
- Supports sharps and flats accurately
- Provides a foundation for interval training, chord training, and advanced modes

The system is accurate, extensible, and aligned with real-world musical standards.
