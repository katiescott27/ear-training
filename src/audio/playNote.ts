// src/audio/playNote.ts
import type { NoteDef } from './notes';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Play a single sine tone at the given frequency (Hz) for durationSeconds.
 */
export async function playFrequency(freq: number, durationSeconds = 1.0) {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;

  const now = ctx.currentTime;

  // Simple envelope: quick fade in, then fade out
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + durationSeconds);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSeconds + 0.05);
}

/**
 * Play a sequence of notes as a scale using the AudioContext timeline,
 * avoiding setTimeout timing issues on first use.
 */
export async function playScaleSequence(
  notes: NoteDef[],
  noteDurationSeconds = 0.6,
  gapSeconds = 0.1
) {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  // Start a tiny bit in the future to be safe
  let t = ctx.currentTime + 0.05;

  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = note.freq;

    // Envelope for this note
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.01);
    gain.gain.linearRampToValueAtTime(0, t + noteDurationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + noteDurationSeconds + 0.05);

    t += noteDurationSeconds + gapSeconds;
  }
}
