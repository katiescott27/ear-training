// src/components/GameScreen.tsx
import React from 'react';

import { useAppDispatch } from '../store/hooks';
import { backToMenu, type GameId } from '../store/uiSlice';

import NoteTrainer from './NoteTrainer';
import IntervalTrainer from './IntervalTrainer';

import styles from './TrainerCommon.module.css';

interface GameScreenProps {
  gameId: GameId;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameId }) => {
  const dispatch = useAppDispatch();

  let title: string;
  let content: React.ReactNode;

  switch (gameId) {
    case 'noteGuess':
      title = 'Note Guess';
      content = <NoteTrainer />;
      break;

    case 'intervalTrainer':
      title = 'Interval Trainer';
      content = <IntervalTrainer />;
      break;

    default:
      title = '';
      content = null;
  }

  return (
    <div className={styles.screenRoot}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => dispatch(backToMenu())}
        >
          ← Back to Games
        </button>
        <h2 className={styles.title}>{title}</h2>
      </header>

      <main className={styles.content}>{content}</main>
    </div>
  );
};

export default GameScreen;
