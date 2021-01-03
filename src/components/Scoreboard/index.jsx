import React from 'react';
import cn from 'classnames';

import useGame from '../../hooks/useGame';
import getUser from '../../hooks/useUser';

import styles from './styles.module.scss';

const ScoreBoard = () => {
  const { game, getActivePlayer } = useGame();
  const { tiles, players, turns = [] } = game;
  const { length: remainingTiles } = tiles.filter(({ used, userId }) => !used && !userId);

  const currentUser = getUser();
  const activePlayer = getActivePlayer();

  return (
    <div
      className={styles.scoreboard}
    >
      <table
        className={cn(
          styles.scoreboard__table,
          'mb-1',
        )}
      >
        <thead>
          <tr>
            <th className={styles['scoreboard__table-heading']}>Player</th>
            <th className={styles['scoreboard__table-heading']}>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const playerTurns = turns.filter(({ userId }) => userId === player.uid);
            const playerScore = playerTurns.reduce((total, { score }) => total + score, 0);

            return (
              <tr
                key={player.uid}
              >
                <td className={styles['scoreboard__table-cell']}>{player.displayName || player.email}</td>
                <td className={styles['scoreboard__table-cell']}>{playerScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        className="d-flex justify-content-space-between"
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
