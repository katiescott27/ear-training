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
 * Play a sequence of notes as a scale using the AudioContext timeline.
 *
 * If `onHighlight` is provided, it is driven off the *same* AudioContext clock
 * via requestAnimationFrame so that visual highlights line up with audio,
 * including on the first use of the AudioContext.
 */
export async function playScaleSequence(
  notes: NoteDef[],
  noteDurationSeconds = 0.6,
  gapSeconds = 0.1,
  onHighlight?: (note: NoteDef | null) => void,
) {
  if (!notes.length) return;

  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  // Schedule audio on the Web Audio timeline
  const startOffsetSeconds = 0.05;
  let t = ctx.currentTime + startOffsetSeconds;

  const schedule: { note: NoteDef; start: number; end: number }[] = [];

  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = note.freq;

    const start = t;
    const end = t + noteDurationSeconds;

    // Envelope
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
    gain.gain.linearRampToValueAtTime(0, end);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(end + 0.05);

    schedule.push({ note, start, end });

    t += noteDurationSeconds + gapSeconds;
  }

  const lastEnd = schedule[schedule.length - 1]?.end ?? t;

  if (!onHighlight) {
    // caller doesn't care about highlights, just return
    return;
  }

  // Drive highlights off the AudioContext clock
  let lastHighlighted: NoteDef | null = null;
  let rafId: number | null = null;

  const step = () => {
    const now = ctx.currentTime;

    // Which note (if any) is currently active on the audio timeline?
    let active: NoteDef | null = null;
    for (const item of schedule) {
      if (now >= item.start && now < item.end) {
        active = item.note;
        break;
      }
    }

    if (active !== lastHighlighted) {
      lastHighlighted = active;
      onHighlight(active);
    }

    if (now < lastEnd + 0.1) {
      rafId = window.requestAnimationFrame(step);
    } else {
      // sequence is done; clear highlight and stop polling
      if (lastHighlighted !== null) {
        onHighlight(null);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    }
  };

  rafId = window.requestAnimationFrame(step);
}
