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

import styles from './TrainerCommon.module.css'; // shared trainer styles

import CurrentScaleBar from './CurrentScaleBar';
import SessionHistory from './SessionHistory';
import ResultMessage from './ResultMessage';
import IntervalGuessButtons from './IntervalGuessButtons';

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

  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const notes: NoteDef[] = activeScale?.notes ?? [];
  const canPlayInterval = !!activeScale;

  const intervalActive =
    firstNoteName !== null && secondNoteName !== null;

  const handlePlayInterval = () => {
    if (notes.length < 2) return;

    // Always start from the lower root note of the scale
    const first = notes[0];

    // Always go UP to another note in the scale (no unison)
    const secondIndex =
      1 + Math.floor(Math.random() * (notes.length - 1));
    const second = notes[secondIndex];

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

    // We always go up, but abs is fine/safe.
    const steps = Math.abs(i2 - i1);
    const correctLabel =
      INTERVAL_LABELS[steps] ?? `${steps} steps`;

    const isCorrect = guessLabel === correctLabel;
    const ts = Date.now();

    // Include the interval distance in the displayed "played" field
    const playedDisplay = `${firstNoteName} → ${secondNoteName} (${correctLabel})`;

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
      <p className={styles.subtitle}>
        Listen to two notes and identify the interval in the current scale.
      </p>

      <CurrentScaleBar />

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

      {lastResult && <ResultMessage lastResult={lastResult} />}

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
