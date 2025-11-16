// src/audio/playNote.ts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Play a sine tone at the given frequency (Hz) for durationSeconds.
 */
export function playFrequency(freq: number, durationSeconds = 1.0) {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    // Usually resumes fine from a click/tap event
    void ctx.resume();
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
