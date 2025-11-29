// src/components/ScaleSelector.tsx

import React from 'react';
import {
  getAllScaleSpecs,
  type ScaleMode,
} from '../audio/notes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setScaleId, setOctave } from '../store/coreSlice';

import styles from './ScaleSelector.module.css';

type ScaleFilterMode = 'all' | ScaleMode;
type AccidentalFilter = 'all' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ScaleSelectorProps {
  onPlayScale: () => void;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ onPlayScale }) => {
  const dispatch = useAppDispatch();
  const { selectedScaleId, selectedOctave } = useAppSelector(
    (state) => state.core,
  );

  const scaleSpecs = getAllScaleSpecs();

  const [modeFilter, setModeFilter] =
    React.useState<ScaleFilterMode>('all');
  const [accidentalFilter, setAccidentalFilter] =
    React.useState<AccidentalFilter>('all');

  const resetScale = () => {
    dispatch(setScaleId(''));
  };

  const filteredSpecs = React.useMemo(
    () =>
      scaleSpecs.filter((spec) => {
        const modeOK =
          modeFilter === 'all' || spec.mode === modeFilter;
        const accOK =
          accidentalFilter === 'all' ||
          spec.accidentalCount === accidentalFilter;
        return modeOK && accOK;
      }),
    [scaleSpecs, modeFilter, accidentalFilter],
  );

  const handleScaleChange = (id: string) => {
    dispatch(setScaleId(id));
  };

  const handleOctaveChange = (octave: number | null) => {
    dispatch(setOctave(octave));
  };

  const canPlayScale =
    selectedScaleId !== '' && selectedOctave !== null;

  return (
    <div className={styles.container}>
      {/* Filters Section */}
      <div className={styles.group}>
        <div className={styles.groupTitle}>Filters</div>
        <div className={styles.groupRow}>
          {/* Mode */}
          <select
            className={styles.select}
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value as ScaleFilterMode);
              resetScale();
            }}
          >
            <option value="all">Mode (All)</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>

          {/* #/♭ Filter */}
          <select
            className={styles.select}
            value={
              accidentalFilter === 'all'
                ? 'all'
                : String(accidentalFilter)
            }
            onChange={(e) => {
              const v = e.target.value;
              const newFilter: AccidentalFilter =
                v === 'all' ? 'all' : (Number(v) as AccidentalFilter);
              setAccidentalFilter(newFilter);
              resetScale();
            }}
          >
            <option value="all">#/♭ (All)</option>
            <option value="0">0 #/♭</option>
            <option value="1">1 #/♭</option>
            <option value="2">2 #/♭</option>
            <option value="3">3 #/♭</option>
            <option value="4">4 #/♭</option>
            <option value="5">5 #/♭</option>
            <option value="6">6 #/♭</option>
            <option value="7">7 #/♭</option>
          </select>
        </div>
      </div>

      {/* Selection Section */}
      <div className={styles.group}>
        <div className={styles.groupTitle}>Selection</div>
        <div className={styles.groupRow}>
          {/* Scale */}
          <select
            className={styles.select}
            value={selectedScaleId || ''}
            onChange={(e) => handleScaleChange(e.target.value)}
          >
            <option value="">Choose Scale</option>
            {filteredSpecs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Octave */}
          <select
            className={styles.select}
            value={selectedOctave ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              handleOctaveChange(v ? Number(v) : null);
            }}
          >
            <option value="">Octave</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>

          {/* Play Scale Button */}
          <button
            className={styles.playButton}
            onClick={onPlayScale}
            disabled={!canPlayScale}
          >
            Play Scale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScaleSelector;
