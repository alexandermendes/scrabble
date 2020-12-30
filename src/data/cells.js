const DOUBLE_LETTER = {
  bonus: 'double-letter',
  tileMultiplier: 2,
};

const TRIPLE_LETTER = {
  bonus: 'triple-letter',
  tileMultiplier: 3,
};

const DOUBLE_WORD = {
  bonus: 'double-word',
  wordMultiplier: 2,
};

const TRIPLE_WORD = {
  bonus: 'triple-word',
  wordMultiplier: 3,
};

const bonusTiles = {
  0: {
    0: TRIPLE_WORD,
    3: DOUBLE_LETTER,
    7: TRIPLE_WORD,
    11: DOUBLE_LETTER,
    14: TRIPLE_WORD,
  },
  1: {
    1: DOUBLE_WORD,
    5: TRIPLE_LETTER,
    9: TRIPLE_LETTER,
    13: DOUBLE_WORD,
  },
  2: {
    2: DOUBLE_WORD,
    6: DOUBLE_LETTER,
    8: DOUBLE_LETTER,
    12: DOUBLE_WORD,
  },
  3: {
    0: DOUBLE_LETTER,
    3: DOUBLE_WORD,
    7: DOUBLE_LETTER,
    11: DOUBLE_WORD,
    14: DOUBLE_LETTER,
  },
  4: {
    4: DOUBLE_WORD,
    10: DOUBLE_WORD,
  },
  5: {
    1: TRIPLE_LETTER,
    5: TRIPLE_LETTER,
    9: TRIPLE_LETTER,
    13: TRIPLE_LETTER,
  },
  6: {
    2: DOUBLE_LETTER,
    6: DOUBLE_LETTER,
    8: DOUBLE_LETTER,
    12: DOUBLE_LETTER,
  },
  7: {
    0: TRIPLE_WORD,
    3: DOUBLE_LETTER,
    7: DOUBLE_WORD,
    11: DOUBLE_LETTER,
    14: TRIPLE_WORD,
  },
  8: {
    2: DOUBLE_LETTER,
    6: DOUBLE_LETTER,
    8: DOUBLE_LETTER,
    12: DOUBLE_LETTER,
  },
  9: {
    1: TRIPLE_LETTER,
    5: TRIPLE_LETTER,
    9: TRIPLE_LETTER,
    13: TRIPLE_LETTER,
  },
  10: {
    4: DOUBLE_WORD,
    10: DOUBLE_WORD,
  },
  11: {
    0: DOUBLE_LETTER,
    3: DOUBLE_WORD,
    7: DOUBLE_LETTER,
    11: DOUBLE_WORD,
    14: DOUBLE_LETTER,
  },
  12: {
    2: DOUBLE_WORD,
    6: DOUBLE_LETTER,
    8: DOUBLE_LETTER,
    12: DOUBLE_WORD,
  },
  13: {
    1: DOUBLE_WORD,
    5: TRIPLE_LETTER,
    9: TRIPLE_LETTER,
    13: DOUBLE_WORD,
  },
  14: {
    0: TRIPLE_WORD,
    3: DOUBLE_LETTER,
    7: TRIPLE_WORD,
    11: DOUBLE_LETTER,
    14: TRIPLE_WORD,
  },
};

/**
 * Get the cells matrix.
 */
export const cells = Array(15).fill().map((_row, rowIndex) => (
  Array(15).fill().map((_cell, cellIndex) => ({
    id: `${rowIndex}:${cellIndex}`,
    ...bonusTiles[rowIndex]?.[cellIndex],
  }))
));

/**
 * Get a cell by ID.
 */
export const getCell = (cellId) => {
  const [rowIndex, cellIndex] = cellId.split(':');

  return cells[rowIndex][cellIndex];
};
