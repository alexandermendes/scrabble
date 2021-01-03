import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import cn from 'classnames';

import ExchangeDrawer from '../ExchangeDrawer';
import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import ScoreBoard from '../Scoreboard';
import InviteLink from '../InviteLink';
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
          className={styles.game__scorebar}
        >
          <ul
            className={styles['game__scorebar-players']}
          >
            {game.players.map((player) => {
              const playerTurns = game.turns.filter(({ userId }) => userId === player.uid);
              const playerScore = playerTurns.reduce((total, { score }) => total + score, 0);

              return (
                <li
                  key={player.uid}
                  className={cn(
                    styles['game__scorebar-player'],
                    {
                      [styles['game__scorebar-player--active']]: getActivePlayer().uid === player.uid,
                    },
                  )}
                >
                  <p className={styles['game__scorebar-player-name']}>{player.displayName || player.email}</p>
                  <p className={styles['game__scorebar-player-score']}>{playerScore}</p>
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
        >
          <ExchangeDrawer />
        </div>
        <Board
          className={styles.game__board}
        />
        <div
          className={cn(
            styles.game__sidebar,
            styles['game__sidebar--right'],
          )}
        >
          <InviteLink
            className="ml-auto mt-1 mr-6 d-flex"
          />
          <ScoreBoard />
        </div>
        <div
          className={styles.game__footer}
        >
          <Button
            onClick={recallTiles}
            variant="secondary"
            tile
          >
            Recall
          </Button>
          <Rack />
          <Button
            onClick={takeTurn}
            variant="secondary"
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
