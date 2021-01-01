import { cells, getCell } from './cells';

const calculateWordScore = (tiles) => {
  let wordScore = 0;
  const wordMultipliers = [];

  tiles.forEach((tile) => {
    const { score } = tile;
    let {
      tileMultiplier = 1,
      wordMultiplier = 1,
    } = getCell(tile.cellId);

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

const getAdjacentTile = (tiles, currentTile, rowModifier, colModifier) => {
  const { rowIndex, colIndex } = getCell(currentTile.cellId);
  const cell = cells[rowIndex + rowModifier]?.[colIndex + colModifier];

  if (!cell) {
    return null;
  }

  return tiles.find(({ cellId }) => cellId === cell.id) || null;
};

const getTileRight = (tiles, currentTile) => getAdjacentTile(tiles, currentTile, 0, 1);

const getTileLeft = (tiles, currentTile) => getAdjacentTile(tiles, currentTile, 0, -1);

const getTileAbove = (tiles, currentTile) => getAdjacentTile(tiles, currentTile, -1, 0);

const getTileBelow = (tiles, currentTile) => getAdjacentTile(tiles, currentTile, 1, 0);

const getLeftMostTile = (tiles, currentTile) => {
  const tileLeft = getTileLeft(tiles, currentTile);

  if (tileLeft) {
    return getLeftMostTile(tiles, tileLeft);
  }

  return currentTile;
};

const getTopMostTile = (tiles, currentTile) => {
  const tileAbove = getTileAbove(tiles, currentTile);

  if (tileAbove) {
    return getTopMostTile(tiles, tileAbove);
  }

  return currentTile;
};

const buildHorizontalWord = (tiles, word) => {
  const lastTile = word[word.length - 1];
  const tileRight = getTileRight(tiles, lastTile);

  if (tileRight) {
    return buildHorizontalWord(tiles, [...word, tileRight]);
  }

  return word;
};

const buildVerticalWord = (tiles, word) => {
  const lastTile = word[word.length - 1];
  const tileBelow = getTileBelow(tiles, lastTile);

  if (tileBelow) {
    return buildVerticalWord(tiles, [...word, tileBelow]);
  }

  return word;
};

const getHorizontalWord = (tiles, startingTile) => {
  const leftMostTile = getLeftMostTile(tiles, startingTile);

  return buildHorizontalWord(tiles, [leftMostTile]);
};

const getVerticalWord = (tiles, startingTile) => {
  const topMostTile = getTopMostTile(tiles, startingTile);

  return buildVerticalWord(tiles, [topMostTile]);
};

export const submitWord = (allTiles, usedTiles) => {
  const usedCells = usedTiles.map(({ cellId }) => getCell(cellId));

  const isHorizontalWord = new Set(usedCells.map(({ rowIndex }) => rowIndex)).size === 1;
  const isVerticalWord = new Set(usedCells.map(({ colIndex }) => colIndex)).size === 1;

  // Confirm in a single row or column
  if (!isHorizontalWord && !isVerticalWord) {
    alert('invalid');

    return {};
  }

  const newWord = isHorizontalWord
    ? getHorizontalWord(allTiles, usedTiles[0])
    : getVerticalWord(allTiles, usedTiles[0]);

  const intersectingWords = usedTiles.reduce((acc, tile) => {
    const tileAbove = getTileAbove(allTiles, tile);
    const tileRight = getTileRight(allTiles, tile);
    const tileBelow = getTileBelow(allTiles, tile);
    const tileLeft = getTileLeft(allTiles, tile);

    if (!isVerticalWord && (tileAbove || tileBelow)) {
      acc.push(getVerticalWord(allTiles, tile));
    }

    if (!isHorizontalWord && (tileLeft || tileRight)) {
      acc.push(getHorizontalWord(allTiles, tile));
    }

    return acc;
  }, []);

  return {
    word: newWord.map(({ letter }) => letter).join(''),
    score: [newWord, ...intersectingWords].reduce((scoreAcc, word) => (
      scoreAcc + calculateWordScore(word)
    ), 0),
  };
};
