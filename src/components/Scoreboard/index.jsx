import React from 'react';

import useGame from '../../hooks/useGame';
import getUser from '../../hooks/useUser';

import styles from './styles.module.scss';

const ScoreBoard = () => {
  const { game, getActivePlayer } = useGame();
  const { tiles } = game;
  const { length: remainingTiles } = tiles.filter(({ used, userId }) => !used && !userId);

  const currentUser = getUser();
  const activePlayer = getActivePlayer();

  return (
    <div
      className={styles.scoreboard}
    >
      <div
        className="d-flex flex-direction-column align-items-center"
      >
        <p
          className={styles.scoreboard__footer}
        >
          {activePlayer.uid === currentUser.uid ? (
            "It's your turn"
          ) : (
            `Waiting for ${activePlayer.displayName}`
          )}
        </p>
        <p
          className={styles.scoreboard__footer}
        >
          {` ${remainingTiles} tile${remainingTiles === 1 ? '' : 's'} remaining`}
        </p>
      </div>
    </div>
  );
};

export default ScoreBoard;
