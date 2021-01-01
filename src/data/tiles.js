import { v4 as uuid } from 'uuid';

/**
 * Create the tiles for a new game.
 */
export const createTiles = () => [
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
].reduce((acc, [letter, amount, score]) => [
  ...acc,
  ...Array(amount).fill().map(() => ({
    id: uuid(),
    type: 'tile',
    letter,
    score,
    cellId: null,
    inRack: false,
    used: false,
  })),
], []);

/**
 * Get a random, unused tile.
 */
export const getRandomTiles = (tiles, number) => {
  let unusedTiles = tiles.filter(({ cellId, inRack }) => !cellId && !inRack);
  const newTiles = [];

  Array(number).fill().forEach(() => {
    if (!unusedTiles) {
      return;
    }

    const newTile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];

    newTiles.push(newTile);

    // Avoid returning the same tile twice
    unusedTiles = unusedTiles.filter((tile) => !newTiles.includes(tile));
  });

  return newTiles;
};
