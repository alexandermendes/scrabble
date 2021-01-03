import { cells, getCell } from './cells';

/**
 * Calculate the score for the given word.
 */
const calculateWordScore = (tiles) => {
  let wordScore = 0;
  const wordMultipliers = [];

  tiles.forEach((tile) => {
    const { score } = tile;
    let {
      tileMultiplier = 1,
      wordMultiplier = 1,
    } = getCell({ id: tile.cellId });

    if (tile.used) {
      tileMultiplier = 1;
      wordMultiplier = 1;
    }

    wordScore += (score * tileMultiplier);

    if (wordMultiplier > 1) {
      wordMultipliers.push(wordMultiplier);
    }
  });

  wordMultipliers.forEach((wordMultiplier) => {
    wordScore *= wordMultiplier;
  });

  return wordScore;
};

/**
 * Get a tile relative to the given tile.
 */
const getRelativeTile = (tiles, currentTile, rowModifier, colModifier) => {
  const { rowIndex, colIndex } = getCell({ id: currentTile.cellId });
  const cell = cells[rowIndex + rowModifier]?.[colIndex + colModifier];

  if (!cell) {
    return null;
  }

  return tiles.find(({ cellId }) => cellId === cell.id) || null;
};

/**
 * Get the tile to the right of the given tile.
 */
const getTileRight = (tiles, currentTile) => getRelativeTile(tiles, currentTile, 0, 1);

/**
 * Get the tile to the left of the given tile.
 */
const getTileLeft = (tiles, currentTile) => getRelativeTile(tiles, currentTile, 0, -1);

/**
 * Get the tile above the given tile.
 */
const getTileAbove = (tiles, currentTile) => getRelativeTile(tiles, currentTile, -1, 0);

/**
 * Get the tile below the given tile.
 */
const getTileBelow = (tiles, currentTile) => getRelativeTile(tiles, currentTile, 1, 0);

/**
 * Get the left most tile connected to the given tile.
 */
const getLeftMostTile = (tiles, currentTile) => {
  const tileLeft = getTileLeft(tiles, currentTile);

  if (tileLeft) {
    return getLeftMostTile(tiles, tileLeft);
  }

  return currentTile;
};

/**
 * Get the top most tile connected to the given tile.
 */
const getTopMostTile = (tiles, currentTile) => {
  const tileAbove = getTileAbove(tiles, currentTile);

  if (tileAbove) {
    return getTopMostTile(tiles, tileAbove);
  }

  return currentTile;
};

/**
 * Follow tiles across to build a word.
 */
const buildHorizontalWord = (tiles, word) => {
  const lastTile = word[word.length - 1];
  const tileRight = getTileRight(tiles, lastTile);

  if (tileRight) {
    return buildHorizontalWord(tiles, [...word, tileRight]);
  }

  return word;
};

/**
 * Follow tiles down to build a word.
 */
const buildVerticalWord = (tiles, word) => {
  const lastTile = word[word.length - 1];
  const tileBelow = getTileBelow(tiles, lastTile);

  if (tileBelow) {
    return buildVerticalWord(tiles, [...word, tileBelow]);
  }

  return word;
};

/**
 * Get a horizontal word based on a starting tile.
 */
const getHorizontalWord = (tiles, startingTile) => {
  const leftMostTile = getLeftMostTile(tiles, startingTile);
  const word = buildHorizontalWord(tiles, [leftMostTile]);

  if (word.length < 2) {
    return [];
  }

  return word;
};

/**
 * Get a vertical word based on a starting tile.
 */
const getVerticalWord = (tiles, startingTile) => {
  const topMostTile = getTopMostTile(tiles, startingTile);
  const word = buildVerticalWord(tiles, [topMostTile]);

  if (word.length < 2) {
    return [];
  }

  return word;
};

/**
 * Check if an array of numbers is consecutive.
 */
const areNumbersConsecutive = (numbers) => {
  const sortedNumbers = numbers.sort((a, b) => a - b);

  return sortedNumbers.reduce((result, currentNum, index) => (
    result && (index === 0 || sortedNumbers[index - 1] + 1 === currentNum)
  ), true);
};

/**
 * Get unique words from an array.
 */
const getUniqueWords = (words) => [...new Map(
  words.map((word) => [
    word.map((tile) => tile.id).sort().join('-'),
    word,
  ]),
).values()];

/**
 * Submit a new word.
 */
export const submitWord = (game, allTiles, usedTiles) => {
  const isFirstTurn = game.turns.length === 0;
  const firstCell = getCell({ row: 7, col: 7 });
  const usesCenterCell = !!usedTiles.find((tile) => tile.cellId === firstCell.id);

  if (!usedTiles.length) {
    throw new Error('No tiles have been placed.');
  }

  if (isFirstTurn && !usesCenterCell) {
    throw new Error('The first word must use the central square.');
  }

  if (isFirstTurn && usedTiles.length < 2) {
    throw new Error('The first word must use at least two tiles.');
  }

  const usedCells = usedTiles.map(({ cellId }) => getCell({ id: cellId }));
  const rowIndicies = [...new Set(usedCells.map(({ rowIndex }) => rowIndex))];
  const colIndicies = [...new Set(usedCells.map(({ colIndex }) => colIndex))];
  const isHorizontalWord = rowIndicies.length === 1;
  const isVerticalWord = colIndicies.length === 1;

  if (!isHorizontalWord && !isVerticalWord) {
    throw new Error('All tiles must be placed in a single row or column.');
  }

  if (!areNumbersConsecutive(rowIndicies) && !areNumbersConsecutive(colIndicies)) {
    throw new Error('All tiles must be connected.');
  }

  const words = usedTiles.reduce((acc, tile) => {
    const tileAbove = getTileAbove(allTiles, tile);
    const tileRight = getTileRight(allTiles, tile);
    const tileBelow = getTileBelow(allTiles, tile);
    const tileLeft = getTileLeft(allTiles, tile);

    if (tileAbove || tileBelow) {
      acc.push(getVerticalWord(allTiles, tile));
    }

    if (tileLeft || tileRight) {
      acc.push(getHorizontalWord(allTiles, tile));
    }

    return acc;
  }, []);

  const uniqueWords = getUniqueWords(words);

  if (
    !isFirstTurn
    && [].concat(...uniqueWords).length === usedTiles.length
  ) {
    throw new Error('At least one tile must join the tiles currently on the board.');
  }

  return uniqueWords.reduce((scoreAcc, word) => (
    scoreAcc + calculateWordScore(word)
  ), 0);
};
