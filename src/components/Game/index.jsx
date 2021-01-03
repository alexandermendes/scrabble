import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import cn from 'classnames';

import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import ScoreBoard from '../Scoreboard';
import useGame from '../../hooks/useGame';

import styles from './styles.module.scss';

const Game = () => {
  const {
    game,
    takeTurn,
    recallTiles,
    getActivePlayer,
  } = useGame();

  return (
    <DndProvider
      backend={HTML5Backend}
    >
      <div
        className={styles.game}
      >
        <div
          className={styles.game__toolbar}
        >
          <ul
            className={styles['game__toolbar-players']}
          >
            {game.players.map((player) => {
              const playerTurns = game.turns.filter(({ userId }) => userId === player.uid);
              const playerScore = playerTurns.reduce((total, { score }) => total + score, 0);

              return (
                <li
                  key={player.uid}
                  className={cn(
                    styles['game__toolbar-player'],
                    {
                      [styles['game__toolbar-player--active']]: getActivePlayer().uid === player.uid,
                    },
                  )}
                >
                  <p className={styles['game__toolbar-player-name']}>{player.displayName || player.email}</p>
                  <p className={styles['game__toolbar-player-score']}>{playerScore}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className={cn(
            styles.game__sidebar,
            styles['game__sidebar--left'],
          )}
        />
        <Board
          className={styles.game__board}
        />
        <div
          className={cn(
            styles.game__sidebar,
            styles['game__sidebar--right'],
          )}
        >
          <ScoreBoard />
        </div>
        <div
          className={styles.game__footer}
        >
          <Button
            onClick={recallTiles}
            secondary
            tile
          >
            Recall
          </Button>
          <Rack />
          <Button
            onClick={takeTurn}
            secondary
            tile
          >
            Submit
          </Button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Game;
