// src/components/EarTrainer.tsx

import React, { useMemo, useState } from 'react';

import {
  buildScaleAtOctave,
  type NoteDef,
  type ScaleDef,
} from '../audio/notes';

import {
  playFrequency,
  playScaleSequence,
} from '../audio/playNote';

import styles from './EarTrainer.module.css';

import ScaleSelector from './ScaleSelector';
import SessionHistory from './SessionHistory';
import ControlsRow from './ControlsRow';
import GuessButtons from './GuessButtons';
import ResultMessage from './ResultMessage';

import type {
  ResultState,
  ScoreState,
  Attempt,
} from './types';

function getRandomNote(notes: NoteDef[]): NoteDef {
  const idx = Math.floor(Math.random() * notes.length);
  return notes[idx];
}

const EarTrainer: React.FC = () => {
  // Start with no scale and no octave selected so the user must choose
  const [selectedScaleId, setSelectedScaleId] = useState<string>('');
  const [selectedOctave, setSelectedOctave] = useState<number | null>(null);

  const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);
  const [score, setScore] = useState<ScoreState>({
    correct: 0,
    total: 0,
  });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  // Build the concrete scale *dynamically* from the selected id + octave
  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const notes: NoteDef[] = activeScale?.notes ?? [];

  const handleChangeScale = (newId: string) => {
    setSelectedScaleId(newId);
    setCurrentNoteName(null);
    setLastResult(null);
  };

  const handleOctaveChange = (octave: number | null) => {
    setSelectedOctave(octave);
    setCurrentNoteName(null);
    setLastResult(null);
  };

  const handlePlayScale = () => {
    if (!activeScale) return;
    void playScaleSequence(activeScale.notes);
  };

  const handlePlayNewNote = () => {
    if (!notes.length) return; // no scale/octave chosen yet
    const note = getRandomNote(notes);
    setCurrentNoteName(note.name);
    setLastResult(null);
    void playFrequency(note.freq);
  };

  const handleReplayNote = () => {
    if (!currentNoteName || !notes.length) return;
    const note = notes.find(n => n.name === currentNoteName);
    if (!note) return;
    void playFrequency(note.freq);
  };

  const handleGuess = (guessName: string) => {
    if (!currentNoteName) return;

    const isCorrect = guessName === currentNoteName;
    const ts = Date.now();

    setLastResult({
      correct: isCorrect,
      played: currentNoteName,
      guess: guessName,
    });

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setHistory(prev => [
      {
        id: nextId,
        ts,
        played: currentNoteName,
        guess: guessName,
        correct: isCorrect,
      },
      ...prev,
    ]);

    setNextId(id => id + 1);
    setCurrentNoteName(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setScore({ correct: 0, total: 0 });
    setLastResult(null);
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

  const canPlayScale = !!activeScale;
  const canPlayNote = !!activeScale;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ear Trainer</h1>
      <p className={styles.subtitle}>
        Choose a scale and octave, press <strong>Play New Note</strong>, listen, then
        guess which note you heard.
      </p>

      <ScaleSelector
        selectedScaleId={selectedScaleId}
        selectedOctave={selectedOctave}
        onScaleChange={handleChangeScale}
        onOctaveChange={handleOctaveChange}
        onPlayScale={handlePlayScale}       // NEW
        canPlayScale={canPlayScale}         // NEW
      />

      {/* Play Scale button row removed – now inside ScaleSelector */}

      <ControlsRow
        onPlayNewNote={handlePlayNewNote}
        onReplayNote={handleReplayNote}
        onClearHistory={handleClearHistory}
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
        onGuess={handleGuess}
      />

      {lastResult && (
        <ResultMessage lastResult={lastResult} />
      )}

      {!currentNoteName && !lastResult && (
        <p className={styles.hintMessage}>
          Press “Play New Note” to start a round.
        </p>
      )}

      <hr className={styles.divider} />

      <h2 className={styles.historyTitle}>Session History</h2>
      <SessionHistory
        history={history}
        formatTime={formatTime}
      />
    </div>
  );
};

export default EarTrainer;
