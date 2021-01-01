import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import ScoreBoard from '../Scoreboard';
import useGame from '../../hooks/useGame';

import styles from './styles.module.scss';

const Game = () => {
  const { takeTurn } = useGame();

  return (
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
          <Rack
            className="mt-auto"
          />
          <Button
            onClick={takeTurn}
          >
            Submit
          </Button>
        </div>
      </main>
    </DndProvider>
  );
};

export default Game;
