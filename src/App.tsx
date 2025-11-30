// src/App.tsx

import React from 'react';
import { useAppSelector } from './store/hooks';

import GameMenu from './components/GameMenu';
import GameScreen from './components/GameScreen';
import ScaleSelectorScreen from './components/ScaleSelectorScreen';

import './global.css';

const App: React.FC = () => {
  const { activeGameId, isSelectingScale } = useAppSelector(
    (state) => state.ui,
  );

  // No game selected yet: show game menu
  if (!activeGameId) {
    return <GameMenu />;
  }

  // Game selected + user is changing scale: show full ScaleSelector screen
  if (isSelectingScale) {
    return <ScaleSelectorScreen />;
  }

  // Game selected, normal mode: show game screen with trainer
  return <GameScreen gameId={activeGameId} />;
};

export default App;
