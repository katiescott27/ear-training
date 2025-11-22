// src/components/EarTrainer.tsx

import React, { useState } from 'react';
import { getScaleById } from '../audio/notes';
import { playFrequency, playScaleSequence } from '../audio/playNote';
import type { NoteDef } from '../audio/notes';

import styles from './EarTrainer.module.css';
import ScaleSelector from './ScaleSelector';
import SessionHistory from './SessionHistory';

export interface ResultState {
  correct: boolean;
  played: string;
  guess: string;
}

export interface ScoreState {
  correct: number;
  total: number;
}

export interface Attempt {
  id: number;
  ts: number;
  played: string;
  guess: string;
  correct: boolean;
}

function getRandomNote(notes: NoteDef[]): NoteDef {
  const idx = Math.floor(Math.random() * notes.length);
  return notes[idx];
}

const EarTrainer: React.FC = () => {
  const scaleControlHeightRem = 1.5;

  const [selectedScaleId, setSelectedScaleId] = useState<string>('c-major');
  const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);
  const [score, setScore] = useState<ScoreState>({ correct: 0, total: 0 });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  const currentScale = getScaleById(selectedScaleId);
  const notes = currentScale.notes;

  const handleChangeScale = (newId: string) => {
    setSelectedScaleId(newId);
    setCurrentNoteName(null);
    setLastResult(null);

    const newScale = getScaleById(newId);
    void playScaleSequence(newScale.notes);
  };

  const handleReplayScale = () => {
    void playScaleSequence(notes);
  };

  const handlePlayNewNote = () => {
    const note = getRandomNote(notes);
    setCurrentNoteName(note.name);
    setLastResult(null);
    void playFrequency(note.freq);
  };

  const handleReplayNote = () => {
    if (!currentNoteName) return;
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
          (score.correct / score.total) * 100
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
      <h1 className={styles.title}>Ear Trainer</h1>
      <p className={styles.subtitle}>
        Choose a scale, press <strong>Play New Note</strong>, listen, then guess which note you
        heard.
      </p>

      <ScaleSelector
        selectedScaleId={selectedScaleId}
        onChangeScale={handleChangeScale}
        onReplayScale={handleReplayScale}
        heightRem={scaleControlHeightRem}
      />

      {/* Controls */}
      <div className={styles.controlsRow}>
        <button onClick={handlePlayNewNote}>Play New Note</button>
        <button onClick={handleReplayNote} disabled={!currentNoteName}>
          Replay Note
        </button>
        <button onClick={handleClearHistory} disabled={history.length === 0}>
          Clear History
        </button>
      </div>

      {/* Score */}
      <div className={styles.scoreRow}>
        <strong>Score:</strong> {scoreText}
      </div>

      {/* Guess buttons */}
      <div className={styles.guessButtonsRow}>
        {notes.map((note, index) => (
          <button
            key={`${currentScale.id}-${index}`}
            onClick={() => handleGuess(note.name)}
            disabled={!currentNoteName}
          >
            {note.name}
          </button>
        ))}
      </div>

      {/* Last result */}
      {lastResult && (
        <div className={styles.resultMessage}>
          {lastResult.correct ? (
            <p className={styles.resultCorrect}>
              ✅ Correct! It was <strong>{lastResult.played}</strong>.
            </p>
          ) : (
            <p className={styles.resultIncorrect}>
              ❌ Not quite. You guessed <strong>{lastResult.guess}</strong>, but it was{' '}
              <strong>{lastResult.played}</strong>.
            </p>
          )}
        </div>
      )}

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

export default EarTrainer;
