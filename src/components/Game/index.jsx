import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { cells, getCell } from '../../data/cells';
import BoardContext from '../../context/BoardContext';
import useBag from '../../hooks/useBag';
import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import ScoreBoard from '../Scoreboard';

import styles from './styles.module.scss';

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

  console.log(`Scored ${wordScore} with ${tiles.map(({ letter }) => letter)}`);

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

// const validateWord = (tiles) => {
//   const cells = tiles.map(({ cellId }) => getCell(cellId));
//   const sameRow = new Set(cells.map(({ rowIndex }) => rowIndex)).size === 1;
//   const sameCol = new Set(cells.map(({ colIndex }) => colIndex)).size === 1;

//   if (!(sameRow || sameCol)) {
//     return false;
//   }

//   return true;
// };

const Game = () => {
  const { tiles, setTiles, getTile } = useBag();

  const updateTiles = () => {
    const currentRackTiles = tiles.filter(({ inRack }) => inRack);
    const nRequired = 7 - currentRackTiles.length;
    const newTiles = [];

    Array(nRequired).fill().forEach(() => {
      const newTile = getTile();

      if (newTile) {
        newTile.inRack = true;
        newTiles.push(newTile);
      }
    });

    setTiles([...tiles]);
  };

  useEffect(() => {
    updateTiles();
  }, []);

  const submit = () => {
    const usedTiles = tiles.filter(({ inRack, cellId }) => inRack && !!cellId);
    const usedCells = usedTiles.map(({ cellId }) => getCell(cellId));

    const isHorizontalWord = new Set(usedCells.map(({ rowIndex }) => rowIndex)).size === 1;
    const isVerticalWord = new Set(usedCells.map(({ colIndex }) => colIndex)).size === 1;

    // Confirm in a single row or column
    if (!isHorizontalWord && !isVerticalWord) {
      alert('invalid');

      return;
    }

    const newWord = isHorizontalWord
      ? getHorizontalWord(tiles, usedTiles[0])
      : getVerticalWord(tiles, usedTiles[0]);

    const intersectingWords = usedTiles.reduce((acc, tile) => {
      const tileAbove = getTileAbove(tiles, tile);
      const tileRight = getTileRight(tiles, tile);
      const tileBelow = getTileBelow(tiles, tile);
      const tileLeft = getTileLeft(tiles, tile);

      if (!isVerticalWord && (tileAbove || tileBelow)) {
        acc.push(getVerticalWord(tiles, tile));
      }

      if (!isHorizontalWord && (tileLeft || tileRight)) {
        acc.push(getHorizontalWord(tiles, tile));
      }

      return acc;
    }, []);

    const score = [newWord, ...intersectingWords].reduce((scoreAcc, word) => (
      scoreAcc + calculateWordScore(word)
    ), 0);

    // TODO: Set score for current player

    usedTiles.forEach((tile) => {
      Object.assign(tile, { used: true, inRack: false });
    });

    setTiles([...tiles]);

    updateTiles();

    // TODO: Switch turns
  };

  return (
    <BoardContext.Provider
      value={{
        tiles,
        setTiles,
      }}
    >
      <DndProvider
        backend={HTML5Backend}
      >
        <main
          className={styles.game}
        >
          <Board />
          <div
            className={styles.game__sidebar}
          >
            <ScoreBoard />
            <Rack />
            <Button
              onClick={submit}
            >
              Submit
            </Button>
          </div>
        </main>
      </DndProvider>
    </BoardContext.Provider>
  );
};

export default Game;