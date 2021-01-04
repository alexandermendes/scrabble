import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import UserContext from '../../src/context/UserContext';
import GameContext from '../../src/context/GameContext';

/**
 * Create a wrapper with the context required for most components.
 */
export const createWrapper = ({
  userContext,
  gameContext,
// eslint-disable-next-line react/prop-types
} = {}) => ({ children }) => (
  <UserContext.Provider
    value={userContext}
  >
    <GameContext.Provider
      value={gameContext}
    >
      <DndProvider
        backend={HTML5Backend}
      >
        {children}
      </DndProvider>
    </GameContext.Provider>
  </UserContext.Provider>
);
