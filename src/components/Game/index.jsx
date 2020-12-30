import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import styles from './styles.module.scss';

import { DOUBLE_LETTER_KEY, getCell, TRIPLE_LETTER_KEY } from '../../data/cells';
import BoardContext from '../../BoardContext';
import useBag from '../../hooks/useBag';
import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';

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

  const calculateWordScore = (wordTiles) => {
    let wordScore = 0;

    wordTiles.forEach((tile) => {
      const { score } = tile;
      const { tileMultiplier = 1 } = getCell(tile.cellId);

      wordScore += (score * tileMultiplier);
    });

    return wordScore;
  };

  const submit = () => {
    const word = tiles.filter(({ inRack, cellId }) => inRack && !!cellId);

    // TODO: intersecting words

    let score = 0;

    calculateWordScore(word);

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
