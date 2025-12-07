// src/components/ScaleSelectorScreen.tsx

import React, { useMemo } from 'react';

import {
  buildScaleAtOctave,
  type ScaleDef,
} from '../../audio/notes';
import { playScaleSequence } from '../../audio/playNote';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeScaleSelector } from '../../store/uiSlice';

import styles from '../ui/GameScreen.module.css';
import ScaleSelector from './ScaleSelector';

const ScaleSelectorScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const activeScale: ScaleDef | null = useMemo(() => {
    if (!selectedScaleId || selectedOctave == null) return null;
    return buildScaleAtOctave(selectedScaleId, selectedOctave);
  }, [selectedScaleId, selectedOctave]);

  const handlePlayScale = () => {
    if (!activeScale) return;
    void playScaleSequence(activeScale.notes);
  };

  return (
    <div className={styles.screenRoot}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => dispatch(closeScaleSelector())}
        >
          ← Back to game
        </button>
        <h2 className={styles.title}>Choose scale &amp; octave</h2>
      </header>

      <main className={styles.content}>
        <ScaleSelector onPlayScale={handlePlayScale} />
      </main>
    </div>
  );
};

export default ScaleSelectorScreen;
