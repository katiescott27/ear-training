import { useAppSelector } from '../../store/hooks';
import styles from './ControlsRow.module.css';

interface ControlsRowProps {
  onPlayNewNote: () => void;
  onReplayNote: () => void;
  onClearHistory: () => void;
}

const ControlsRow: React.FC<ControlsRowProps> = ({
  onPlayNewNote,
  onReplayNote,
  onClearHistory
}) => {

  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const { currentNoteName, history } = useAppSelector(
    (state) => state.noteTrainer,
  );

  const canPlayNote = !!selectedScaleId && selectedOctave != null;

  const disablePlayNew = !canPlayNote;
  const disableReplay = !canPlayNote || !currentNoteName;
  const disableClear = history.length === 0;

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
