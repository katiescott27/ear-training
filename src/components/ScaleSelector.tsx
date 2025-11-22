import React from 'react';
import styles from './EarTrainer.module.css';
import { SCALES } from '../audio/notes';

interface ScaleSelectorProps {
  selectedScaleId: string;
  onChangeScale: (id: string) => void;
  onReplayScale: () => void;
  heightRem?: number;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  selectedScaleId,
  onChangeScale,
  onReplayScale,
  heightRem = 1.5,
}) => {
  const fontSize = `${heightRem * 0.6}rem`;
  const rowHeight = `${heightRem}rem`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeScale(e.target.value);
  };

  return (
    <div
      className={styles.scaleRow}
      style={{ fontSize }}
    >
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
          value={selectedScaleId}
          onChange={handleChange}
          className={styles.scaleSelect}
        >
          {SCALES.map(scale => (
            <option key={scale.id} value={scale.id}>
              {scale.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReplayScale}
          className={styles.scaleReplayButton}
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
