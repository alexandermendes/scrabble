import React, { useEffect, useState, useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import ScoreBoard from '../Scoreboard';
import useGame from '../../hooks/useGame';
import TileSizeContext from '../../context/TileSizeContext';

import styles from './styles.module.scss';

const Game = () => {
  const { takeTurn, recallTiles } = useGame();
  const boardRef = useRef();
  const [tileSize, setTileSize] = useState(0);

  const gridGap = 2;
  const rows = 15;

  // Set the tile size according to available screen size
  useEffect(() => {
    const { height } = boardRef.current.getBoundingClientRect();
    const gridGaps = rows + 1;

    setTileSize((height - (gridGaps * gridGap)) / rows);
  }, []);

  return (
    <DndProvider
      backend={HTML5Backend}
    >
      <div
        className={styles.game}
      >
        <TileSizeContext.Provider
          value={{
            boardRef,
            gridGap,
            tileSize,
          }}
        >
          <Board
            className={styles.game__board}
          />
          <div
            className={styles.game__sidebar}
          >
            <ScoreBoard />
            <Rack
              tileSize={tileSize}
              className="mt-auto"
            />
            <Button
              onClick={takeTurn}
            >
              Submit
            </Button>
            <Button
              onClick={recallTiles}
            >
              Recall
            </Button>
          </div>
        </TileSizeContext.Provider>
      </div>
    </DndProvider>
  );
};

export default Game;
