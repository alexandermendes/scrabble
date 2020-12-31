import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const useBag = () => {
  const createTiles = (arr) => arr.reduce((acc, [letter, amount, score]) => [
    ...acc,
    ...new Array(amount).fill().map(() => ({
      id: uuid(),
      type: 'tile',
      letter,
      score,
      cellId: null,
      inRack: false,
      used: false,
    })),
  ], []);

  const [tiles, setTiles] = useState(createTiles([
    ['', 2, 0],
    ['A', 9, 1],
    ['B', 2, 3],
    ['C', 2, 3],
    ['D', 4, 2],
    ['E', 12, 1],
    ['F', 2, 4],
    ['G', 3, 2],
    ['H', 2, 4],
    ['I', 9, 1],
    ['J', 1, 8],
    ['K', 1, 5],
    ['L', 4, 1],
    ['M', 2, 3],
    ['N', 6, 1],
    ['O', 8, 1],
    ['P', 2, 3],
    ['Q', 1, 10],
    ['R', 6, 1],
    ['S', 4, 1],
    ['T', 6, 1],
    ['U', 4, 1],
    ['V', 2, 4],
    ['W', 2, 4],
    ['X', 1, 8],
    ['Y', 2, 4],
    ['Z', 1, 10],
  ]));

  const getTile = () => {
    const currentTiles = [...tiles];
    const unusedTiles = currentTiles.filter(({ cellId, inRack }) => !cellId && !inRack);
    const tile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];

    return tile;
  };

  return { tiles, getTile, setTiles };
};

export default useBag;