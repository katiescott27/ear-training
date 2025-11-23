import React from 'react';
import styles from './EarTrainer.module.css';
import type { Attempt } from './types';

interface SessionHistoryProps {
  history: Attempt[];
  formatTime: (ts: number) => string;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ history, formatTime }) => {
  if (history.length === 0) {
    return <p className={styles.historyEmpty}>No attempts yet.</p>;
  }

  return (
    <div className={styles.historyContainer}>
      <table className={styles.historyTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Played</th>
            <th>Guess</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map(attempt => (
            <tr key={attempt.id}>
              <td>{formatTime(attempt.ts)}</td>
              <td>{attempt.played}</td>
              <td>{attempt.guess}</td>
              <td
                className={
                  attempt.correct
                    ? styles.historyResultCorrect
                    : styles.historyResultIncorrect
                }
              >
                {attempt.correct ? 'Correct' : 'Incorrect'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistory;
