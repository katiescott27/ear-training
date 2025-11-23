// src/components/ControlsRow.tsx

import React from 'react';
import styles from './EarTrainer.module.css';

interface ControlsRowProps {
  onPlayNewNote: () => void;
  onReplayNote: () => void;
  onClearHistory: () => void;
  disableReplay: boolean;
  disableClear: boolean;
}

const ControlsRow: React.FC<ControlsRowProps> = ({
  onPlayNewNote,
  onReplayNote,
  onClearHistory,
  disableReplay,
  disableClear,
}) => {
  return (
    <div className={styles.controlsRow}>
      <button onClick={onPlayNewNote}>Play New Note</button>
      <button onClick={onReplayNote} disabled={disableReplay}>
        Replay Note
      </button>
      <button onClick={onClearHistory} disabled={disableClear}>
        Clear History
      </button>
    </div>
  );
};

export default ControlsRow;
