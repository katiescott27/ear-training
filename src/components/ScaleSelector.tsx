// src/components/ScaleSelector.tsx

import React from 'react';
import styles from './EarTrainer.module.css';
import type { ScaleDef, ScaleMode } from '../audio/notes';

type ScaleFilterMode = 'all' | ScaleMode;

interface ScaleSelectorProps {
  selectedScaleId: string;
  onChangeScale: (id: string) => void;
  onReplayScale: () => void;
  heightRem?: number;

  scales: ScaleDef[];
  filterMode: ScaleFilterMode;
  onChangeFilterMode: (mode: ScaleFilterMode) => void;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  selectedScaleId,
  onChangeScale,
  onReplayScale,
  heightRem = 1.5,
  scales,
  filterMode,
  onChangeFilterMode,
}) => {
  const fontSize = `${heightRem * 0.6}rem`;
  const rowHeight = `${heightRem}rem`;

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeScale(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ScaleFilterMode;
    onChangeFilterMode(value);
  };

  const hasScales = scales.length > 0;

  return (
    <div
      className={styles.scaleRow}
      style={{ fontSize }}
    >
      {/* Type filter */}
      <label
        htmlFor="scale-type-select"
        className={styles.scaleLabel}
        style={{ lineHeight: rowHeight, height: rowHeight }}
      >
        <strong>Type:</strong>
      </label>
      <select
        id="scale-type-select"
        value={filterMode}
        onChange={handleFilterChange}
        className={styles.scaleSelect}
        style={{ height: rowHeight }}
      >
        <option value="all">All</option>
        <option value="major">Major</option>
        <option value="minor">Minor</option>
      </select>

      {/* Scale selector */}
      <label
        htmlFor="scale-select"
        className={styles.scaleLabel}
        style={{ lineHeight: rowHeight, height: rowHeight }}
      >
        <strong>Scale:</strong>
      </label>

      <div
        className={styles.scaleControls}
        style={{ height: rowHeight }}
      >
        <select
          id="scale-select"
          value={hasScales ? selectedScaleId : ''}
          onChange={handleScaleChange}
          className={styles.scaleSelect}
          disabled={!hasScales}
        >
          {scales.map(scale => (
            <option key={scale.id} value={scale.id}>
              {scale.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReplayScale}
          className={styles.scaleReplayButton}
          disabled={!hasScales}
        >
          Play Scale Again
        </button>
      </div>

      <span className={styles.scaleHint}>
        (Scale plays ascending once)
      </span>
    </div>
  );
};

export default ScaleSelector;
