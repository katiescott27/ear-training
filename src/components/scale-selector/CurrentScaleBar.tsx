// src/components/CurrentScaleBar.tsx

import React, { useMemo } from 'react';

import {
  buildScaleAtOctave,
  type ScaleDef,
  type NoteDef,
} from '../../audio/notes';

import { playScaleSequence } from '../../audio/playNote';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { openScaleSelector } from '../../store/uiSlice';
import { setHighlightedNote } from '../../store/noteTrainerSlice';

import styles from './CurrentScaleBar.module.css';

const CurrentScaleBar: React.FC = () => {
  const dispatch = useAppDispatch();

  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const label = activeScale?.label ?? activeScale?.id ?? 'C Major';

  const handlePlayScale = () => {
    if (!activeScale) return;

    const notes: NoteDef[] = activeScale.notes;
    if (!notes.length) return;

    void playScaleSequence(notes, 0.6, 0.1, (noteOrNull) => {
      if (!noteOrNull) {
        dispatch(setHighlightedNote(null));
      } else {
        dispatch(setHighlightedNote(noteOrNull.freq));
      }
    });
  };

  return (
    <div className={styles.row}>
      <span className={styles.text}>
        {label} (Octave {selectedOctave})
      </span>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={handlePlayScale}
          aria-label="Play scale"
        >
          ▶️
        </button>

        <button
          type="button"
          className={styles.iconButton}
          onClick={() => dispatch(openScaleSelector())}
          aria-label="Change scale"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default CurrentScaleBar;
