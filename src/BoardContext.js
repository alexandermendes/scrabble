import { createContext } from 'react';

const BoardContext = createContext({
  tiles: [],
  setTiles: () => {},
});

export default BoardContext;
