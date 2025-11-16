// src/components/EarTrainer.tsx

import React, { useState } from 'react';
import { SCALES, getScaleById } from '../audio/notes';
import { playFrequency, playScaleSequence } from '../audio/playNote';

import type { NoteDef } from '../audio/notes';

interface ResultState {
  correct: boolean;
  played: string;
  guess: string;
}

interface ScoreState {
  correct: number;
  total: number;
}

interface Attempt {
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
  const [selectedScaleId, setSelectedScaleId] = useState<string>('c-major');
  const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);
  const [score, setScore] = useState<ScoreState>({ correct: 0, total: 0 });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  const currentScale = getScaleById(selectedScaleId);
  const notes = currentScale.notes;

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedScaleId(newId);

    // Clear current round when changing scales
    setCurrentNoteName(null);
    setLastResult(null);

    const newScale = getScaleById(newId);
    
    // Using void is just to ignore the Promise cleanly
    void playScaleSequence(newScale.notes);
  };

  const handlePlayNewNote = () => {
    const note = getRandomNote(notes);
    setCurrentNoteName(note.name);
    setLastResult(null); // clear previous result
    playFrequency(note.freq);
  };

  const handleReplayNote = () => {
    if (!currentNoteName) return;
    const note = notes.find(n => n.name === currentNoteName);
    if (!note) return;
    playFrequency(note.freq);
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

    // For now, end the round after one guess:
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
    <div
      style={{
        maxWidth: 640,
        margin: '2rem auto',
        padding: '1.5rem',
        borderRadius: 12,
        border: '1px solid #ddd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '0.5rem' }}>Ear Trainer</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Choose a scale, press <strong>Play New Note</strong>, listen, then guess which note you
        heard.
      </p>

      {/* Scale selector */}
      <div
        style={{
          marginTop: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <label htmlFor="scale-select">
          <strong>Scale:</strong>
        </label>
        <select
          id="scale-select"
          value={selectedScaleId}
          onChange={handleScaleChange}
        >
          {SCALES.map(scale => (
            <option key={scale.id} value={scale.id}>
              {scale.label}
            </option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handlePlayNewNote} style={{ marginRight: '0.5rem' }}>
          Play New Note
        </button>
        <button
          onClick={handleReplayNote}
          disabled={!currentNoteName}
          style={{ marginRight: '0.5rem' }}
        >
          Replay Note
        </button>
        <button onClick={handleClearHistory} disabled={history.length === 0}>
          Clear History
        </button>
      </div>

      {/* Score */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>Score:</strong> {scoreText}
      </div>

      {/* Guess buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
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
        <div style={{ marginBottom: '1rem' }}>
          {lastResult.correct ? (
            <p style={{ color: 'green', margin: 0 }}>
              ✅ Correct! It was <strong>{lastResult.played}</strong>.
            </p>
          ) : (
            <p style={{ color: 'red', margin: 0 }}>
              ❌ Not quite. You guessed <strong>{lastResult.guess}</strong>, but it was{' '}
              <strong>{lastResult.played}</strong>.
            </p>
          )}
        </div>
      )}

      {!currentNoteName && !lastResult && (
        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#777' }}>
          Press “Play New Note” to start a round.
        </p>
      )}

      {/* Session history */}
      <hr style={{ margin: '1.5rem 0' }} />

      <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Session History</h2>
      {history.length === 0 ? (
        <p style={{ color: '#777' }}>No attempts yet.</p>
      ) : (
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem' }}>Played</th>
                <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem' }}>Guess</th>
                <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map(attempt => (
                <tr key={attempt.id}>
                  <td
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {formatTime(attempt.ts)}
                  </td>
                  <td
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {attempt.played}
                  </td>
                  <td
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {attempt.guess}
                  </td>
                  <td
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderTop: '1px solid #eee',
                      color: attempt.correct ? 'green' : 'red',
                    }}
                  >
                    {attempt.correct ? 'Correct' : 'Incorrect'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EarTrainer;