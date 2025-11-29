// src/components/NoteTrainer.tsx

import React, { useMemo } from 'react';

import {
  buildScaleAtOctave,
  type NoteDef,
  type ScaleDef,
} from '../audio/notes';

import {
  playFrequency,
  playScaleSequence,
} from '../audio/playNote';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  startNewRound,
  clearCurrentNote,
  recordAttempt,
  clearHistory,
} from '../store/noteGuessSlice';

import styles from './TrainerCommon.module.css';

import ScaleSelector from './ScaleSelector';
import ControlsRow from './ControlsRow';
import GuessButtons from './GuessButtons';
import ResultMessage from './ResultMessage';
import SessionHistory from './SessionHistory';

function getRandomNote(notes: NoteDef[]): NoteDef {
  const idx = Math.floor(Math.random() * notes.length);
  return notes[idx];
}

const NoteTrainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const {
    currentNoteName,
    lastResult,
    score,
    history,
  } = useAppSelector((state) => state.noteGuess);

  // Build the concrete scale from the selected id + octave
  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const notes: NoteDef[] = activeScale?.notes ?? [];
  const canPlayNote = !!activeScale;

  // === Play scale (delegated to ScaleSelector button) ===
  const handlePlayScale = () => {
    if (!activeScale) return;
    void playScaleSequence(activeScale.notes);
  };

  // === NOTE GAME ===

  const handlePlayNewNote = () => {
    if (!notes.length) return; // no scale/octave chosen yet
    const note = getRandomNote(notes);
    dispatch(startNewRound({ noteName: note.name }));
    void playFrequency(note.freq);
  };

  const handleReplayNote = () => {
    if (!currentNoteName || !notes.length) return;
    const note = notes.find((n) => n.name === currentNoteName);
    if (!note) return;
    void playFrequency(note.freq);
  };

  const handleGuessNote = (guessName: string) => {
    if (!currentNoteName) return;

    const isCorrect = guessName === currentNoteName;
    const ts = Date.now();

    dispatch(
      recordAttempt({
        played: currentNoteName,
        guess: guessName,
        correct: isCorrect,
        ts,
      }),
    );

    dispatch(clearCurrentNote());
  };

  const handleClearNoteHistory = () => {
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
      {/* GameScreen shows the big title; this can be a softer subtitle */}
      <p className={styles.subtitle}>
        Choose a scale and octave, then listen and identify single notes.
      </p>

      {/* Scale + octave + Play Scale (button lives inside ScaleSelector) */}
      <ScaleSelector onPlayScale={handlePlayScale} />

      <ControlsRow
        onPlayNewNote={handlePlayNewNote}
        onReplayNote={handleReplayNote}
        onClearHistory={handleClearNoteHistory}
        disablePlayNew={!canPlayNote}
        disableReplay={!currentNoteName || !canPlayNote}
        disableClear={history.length === 0}
      />

      <div className={styles.scoreRow}>
        <strong>Score:</strong> {scoreText}
      </div>

      <GuessButtons
        notes={notes}
        currentScaleId={activeScale?.id ?? ''}
        disabled={!currentNoteName || !canPlayNote}
        onGuess={handleGuessNote}
      />

      {lastResult && <ResultMessage lastResult={lastResult} />}

      {!currentNoteName && !lastResult && (
        <p className={styles.hintMessage}>
          Press “Play New Note” to start a round.
        </p>
      )}

      <hr className={styles.divider} />

      <h2 className={styles.historyTitle}>Session History</h2>
      <SessionHistory history={history} formatTime={formatTime} />
    </div>
  );
};

export default NoteTrainer;
