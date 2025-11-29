// src/components/GameMenu.tsx
import React from 'react';

import { useAppDispatch } from '../store/hooks';
import { selectGame } from '../store/uiSlice';

import styles from './GameMenu.module.css';

const GameMenu: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.menuRoot}>
      <h1 className={styles.title}>Ear Trainer</h1>

      <p className={styles.subtitle}>Choose a game to begin:</p>

      <div className={styles.buttonGrid}>
        <button
          type="button"
          className={styles.gameButton}
          onClick={() => dispatch(selectGame('noteGuess'))}
        >
          Note Guess
        </button>

        <button
          type="button"
          className={styles.gameButton}
          onClick={() => dispatch(selectGame('intervalTrainer'))}
        >
          Interval Trainer
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
