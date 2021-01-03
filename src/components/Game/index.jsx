import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import cn from 'classnames';
import { FaPlus } from 'react-icons/fa';

import ExchangeDrawer from '../ExchangeDrawer';
import Board from '../Board';
import Rack from '../Rack';
import Button from '../Button';
import InviteLink from '../InviteLink';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';
import useNewGame from '../../hooks/useNewGame';

import styles from './styles.module.scss';

const Game = () => {
  const {
    game,
    takeTurn,
    recallTiles,
    getActivePlayer,
  } = useGame();
  const createNewGame = useNewGame();
  const currentUser = useUser();
  const activePlayer = getActivePlayer();

  const { length: remainingTiles } = game.tiles.filter(({ used, userId }) => !used && !userId);

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
                      [styles['game__scorebar-player--active']]: activePlayer.uid === player.uid,
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
            'd-flex flex-direction-column justify-content-space-between align-items-center',
          )}
        >
          <Button
            onClick={createNewGame}
            variant="inverted"
            className="mr-auto mt-1 ml-3 d-flex"
          >
            <FaPlus />
            <p
              className="ml-2"
            >
              Create new game
            </p>
          </Button>
          <div />
          <ExchangeDrawer />
        </div>
        <Board
          className={styles.game__board}
        />
        <div
          className={cn(
            styles.game__sidebar,
            styles['game__sidebar--right'],
            'd-flex flex-direction-column justify-content-space-between',
          )}
        >
          <InviteLink
            className="ml-auto mt-1 mr-6 d-flex"
          />
          <div
            className={styles.game__summary}
          >
            <div
              className="d-flex flex-direction-column align-items-center"
            >
              <p
                className="mb-4"
              >
                {activePlayer.uid === currentUser.uid ? (
                  "It's your turn"
                ) : (
                  `Waiting for ${activePlayer.displayName}`
                )}
              </p>
              <p>
                {`${remainingTiles} tile${remainingTiles === 1 ? '' : 's'} remaining`}
              </p>
            </div>
          </div>
          <div />
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
