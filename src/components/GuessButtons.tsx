// src/components/GuessButtons.tsx

import React from 'react';
import styles from './EarTrainer.module.css';
import type { NoteDef } from '../audio/notes';

interface GuessButtonsProps {
  notes: NoteDef[];
  currentScaleId: string;
  disabled: boolean;
  onGuess: (noteName: string) => void;
}

const GuessButtons: React.FC<GuessButtonsProps> = ({
  notes,
  currentScaleId,
  disabled,
  onGuess,
}) => {
  return (
    <div className={styles.guessButtonsRow}>
      {notes.map((note, index) => (
        <button
          key={`${currentScaleId}-${index}`}
          onClick={() => onGuess(note.name)}
          disabled={disabled}
        >
          {note.name}
        </button>
      ))}
    </div>
  );
};

export default GuessButtons;
