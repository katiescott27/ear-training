// src/components/IntervalGuessButtons.tsx

import React from 'react';
import styles from './TrainerCommon.module.css';

const INTERVAL_OPTIONS = [
  'unison',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  'octave',
];

interface IntervalGuessButtonsProps {
  disabled: boolean;
  onGuess: (intervalLabel: string) => void;
}

const IntervalGuessButtons: React.FC<IntervalGuessButtonsProps> = ({
  disabled,
  onGuess,
}) => {
  return (
    <div className={styles.guessButtonsRow}>
      {INTERVAL_OPTIONS.map((label) => (
        <button
          key={label}
          type="button"
          className={styles.guessButton}
          disabled={disabled}
          onClick={() => onGuess(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default IntervalGuessButtons;
