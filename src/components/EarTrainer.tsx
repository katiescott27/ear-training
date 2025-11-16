// src/components/EarTrainer.tsx

import React, { useState } from 'react';
import { NOTES } from '../audio/notes';
import { playFrequency } from '../audio/playNote';

interface ResultState {
  correct: boolean;
  played: string;
  guess: string;
}

interface ScoreState {
  correct: number;
  total: number;
}

function getRandomNote() {
  const idx = Math.floor(Math.random() * NOTES.length);
  return NOTES[idx];
}

const EarTrainer: React.FC = () => {
  const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);
  const [score, setScore] = useState<ScoreState>({ correct: 0, total: 0 });

  const handlePlayNewNote = () => {
    const note = getRandomNote();
    setCurrentNoteName(note.name);
    setLastResult(null); // clear previous result
    playFrequency(note.freq);
  };

  const handleReplayNote = () => {
    if (!currentNoteName) return;
    const note = NOTES.find(n => n.name === currentNoteName);
    if (!note) return;
    playFrequency(note.freq);
  };

  const handleGuess = (guessName: string) => {
    if (!currentNoteName) return;

    const isCorrect = guessName === currentNoteName;
    setLastResult({
      correct: isCorrect,
      played: currentNoteName,
      guess: guessName,
    });

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    // For now, end the round after one guess:
    setCurrentNoteName(null);
  };

  const scoreText =
    score.total === 0
      ? '—'
      : `${score.correct} / ${score.total} (${Math.round(
          (score.correct / score.total) * 100
        )}%)`;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '2rem auto',
        padding: '1.5rem',
        borderRadius: 12,
        border: '1px solid #ddd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '0.5rem' }}>Ear Trainer – C Major</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Press <strong>Play New Note</strong>, listen, then guess which note of the C scale you
        heard.
      </p>

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <button onClick={handlePlayNewNote} style={{ marginRight: '0.5rem' }}>
          Play New Note
        </button>
        <button onClick={handleReplayNote} disabled={!currentNoteName}>
          Replay Note
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Score:</strong> {scoreText}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        {NOTES.map(note => (
          <button
            key={note.name}
            onClick={() => handleGuess(note.name)}
            disabled={!currentNoteName}
          >
            {note.name}
          </button>
        ))}
      </div>

      {lastResult && (
        <div>
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
    </div>
  );
};

export default EarTrainer;
