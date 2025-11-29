// src/App.tsx
import React from 'react';
import { useAppSelector } from './store/hooks';

import GameMenu from './components/GameMenu';
import GameScreen from './components/GameScreen';

import './global.css';

const App: React.FC = () => {
  const activeGameId = useAppSelector((state) => state.ui.activeGameId);

  if (!activeGameId) {
    // Screen 1: game selection menu
    return <GameMenu />;
  }

  // Screen 2: specific game
  return <GameScreen gameId={activeGameId} />;
};

export default App;
