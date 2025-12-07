// src/components/GuessButtons.tsx

import React, { useMemo } from 'react';

import { useAppSelector } from '../../store/hooks';
import {
  buildScaleAtOctave,
  type NoteDef,
  type ScaleDef,
} from '../../audio/notes';

import styles from '../common/TrainerCommon.module.css';

interface GuessButtonsProps {
  onGuess: (noteName: string) => void;
}

const GuessButtons: React.FC<GuessButtonsProps> = ({ onGuess }) => {
  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const { currentNoteName, highlightedNoteFreq } = useAppSelector(
    (state) => state.noteTrainer,
  );

  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const notes: NoteDef[] = activeScale?.notes ?? [];

  const canPlayNote = !!selectedScaleId && selectedOctave != null;
  const disabled =
    !canPlayNote || !currentNoteName || notes.length === 0;

  return (
    <div className={styles.guessButtonsRow}>
      {notes.map((note, index) => {

        const isHighlighted = highlightedNoteFreq != null && note.freq === highlightedNoteFreq;
        
        return (
          <button
            key={`${selectedScaleId}-${index}`}
            onClick={() => onGuess(note.name)}
            disabled={disabled}
            className={`${styles.guessButton} ${
              isHighlighted ? styles.guessButtonHighlighted : ''
            }`}
          >
            {note.name}
          </button>
        );
      })}
    </div>
  );
};

export default GuessButtons;
