import { createContext } from 'react';

const GameContext = createContext({
  tiles: [],
  setTiles: () => {},
});

export default GameContext;
