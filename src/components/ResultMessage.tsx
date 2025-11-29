// src/components/ResultMessage.tsx

import React from 'react';
import styles from './TrainerCommon.module.css';
import type { ResultState } from './types';

interface ResultMessageProps {
  lastResult: ResultState;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ lastResult }) => {
  return (
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
  );
};

export default ResultMessage;
