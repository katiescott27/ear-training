import styles from './ControlsRow.module.css';

interface ControlsRowProps {
  onPlayNewNote: () => void;
  onReplayNote: () => void;
  onClearHistory: () => void;
  disablePlayNew: boolean;
  disableReplay: boolean;
  disableClear: boolean;
}

const ControlsRow: React.FC<ControlsRowProps> = ({
  onPlayNewNote,
  onReplayNote,
  onClearHistory,
  disablePlayNew,
  disableReplay,
  disableClear,
}) => {
  return (
    <div className={styles.controlsRow}>
      <button
        className={styles.button}
        onClick={onPlayNewNote}
        disabled={disablePlayNew}
      >
        Play New Note
      </button>

      <button
        className={styles.button}
        onClick={onReplayNote}
        disabled={disableReplay}
      >
        Replay Note
      </button>

      <button
        className={styles.button}
        onClick={onClearHistory}
        disabled={disableClear}
      >
        Clear History
      </button>
    </div>
  );
};

export default ControlsRow;
