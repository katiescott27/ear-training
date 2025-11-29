// src/components/IntervalTrainer.tsx

import React, { useMemo } from 'react';

import {
  buildScaleAtOctave,
  type NoteDef,
  type ScaleDef,
} from '../audio/notes';
import { playScaleSequence } from '../audio/playNote';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  startNewRound,
  clearIntervalNotes,
  recordAttempt,
  clearHistory,
} from '../store/intervalSlice';

import styles from './TrainerCommon.module.css';

import ScaleSelector from './ScaleSelector';
import SessionHistory from './SessionHistory';
import ResultMessage from './ResultMessage';
import IntervalGuessButtons from './IntervalGuessButtons';

// Map "steps apart in the scale" -> interval label
const INTERVAL_LABELS: Record<number, string> = {
  0: 'unison',
  1: '2nd',
  2: '3rd',
  3: '4th',
  4: '5th',
  5: '6th',
  6: '7th',
  7: 'octave',
};

function getRandomNote(notes: NoteDef[]): NoteDef {
  const idx = Math.floor(Math.random() * notes.length);
  return notes[idx];
}

const IntervalTrainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const {
    firstNoteName,
    secondNoteName,
    lastResult,
    score,
    history,
  } = useAppSelector((state) => state.interval);

  // Build the concrete scale from the selected id + octave
  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const notes: NoteDef[] = activeScale?.notes ?? [];
  const canPlayInterval = !!activeScale;

  const intervalActive =
    firstNoteName !== null && secondNoteName !== null;

  const handlePlayInterval = () => {
    if (!notes.length) return;

    const first = getRandomNote(notes);
    let second = getRandomNote(notes);

    // Optionally avoid unison if multiple notes exist
    if (notes.length > 1) {
      let safety = 0;
      while (second.name === first.name && safety < 10) {
        second = getRandomNote(notes);
        safety += 1;
      }
    }

    dispatch(
      startNewRound({
        firstNoteName: first.name,
        secondNoteName: second.name,
      }),
    );

    void playScaleSequence([first, second]);
  };

  const handleReplayInterval = () => {
    if (!firstNoteName || !secondNoteName || !notes.length) return;

    const first = notes.find((n) => n.name === firstNoteName);
    const second = notes.find((n) => n.name === secondNoteName);
    if (!first || !second) return;

    void playScaleSequence([first, second]);
  };

  const handleGuessInterval = (guessLabel: string) => {
    if (!firstNoteName || !secondNoteName || !notes.length) return;

    const i1 = notes.findIndex((n) => n.name === firstNoteName);
    const i2 = notes.findIndex((n) => n.name === secondNoteName);
    if (i1 === -1 || i2 === -1) return;

    const steps = Math.abs(i2 - i1);
    const correctLabel =
      INTERVAL_LABELS[steps] ?? `${steps} steps`;

    const isCorrect = guessLabel === correctLabel;
    const ts = Date.now();

    const playedDisplay = `${firstNoteName} → ${secondNoteName}`;

    dispatch(
      recordAttempt({
        played: playedDisplay,
        guess: guessLabel,
        correct: isCorrect,
        ts,
      }),
    );

    dispatch(clearIntervalNotes());
  };

  const handlePlayScale = () => {
    if (!activeScale) return;
    void playScaleSequence(activeScale.notes);
  };


  const handleClearIntervalHistory = () => {
    dispatch(clearHistory());
  };

  const scoreText =
    score.total === 0
      ? '—'
      : `${score.correct} / ${score.total} (${Math.round(
          (score.correct / score.total) * 100,
        )}%)`;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      {/* GameScreen already shows the title; you can keep this small or remove it */}
      <p className={styles.subtitle}>
        Choose a scale and octave, then play and identify intervals.
      </p>

      {/* Scale + octave selection (Play Scale button lives inside ScaleSelector now) */}
      <ScaleSelector onPlayScale={handlePlayScale} />

      {/* Interval game controls */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handlePlayInterval}
          disabled={!canPlayInterval}
        >
          Play Interval
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleReplayInterval}
          disabled={!intervalActive || !canPlayInterval}
        >
          Replay Interval
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleClearIntervalHistory}
          disabled={history.length === 0}
        >
          Clear History
        </button>
      </div>

      <div className={styles.scoreRow}>
        <strong>Score:</strong> {scoreText}
      </div>

      <IntervalGuessButtons
        disabled={!intervalActive || !canPlayInterval}
        onGuess={handleGuessInterval}
      />

      {lastResult && (
        <ResultMessage lastResult={lastResult} />
      )}

      {!intervalActive && !lastResult && (
        <p className={styles.hintMessage}>
          Press “Play Interval” to start a round.
        </p>
      )}

      <hr className={styles.divider} />

      <h2 className={styles.historyTitle}>Session History</h2>
      <SessionHistory history={history} formatTime={formatTime} />
    </div>
  );
};

export default IntervalTrainer;
