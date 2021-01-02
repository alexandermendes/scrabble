import React from 'react';

import useGame from '../../hooks/useGame';

import styles from './styles.module.scss';

const ScoreBoard = () => {
  const { game, getActiveUser } = useGame();
  const { tiles, players, turns = [] } = game;
  const { length: remainingTiles } = tiles.filter(({ used, userId }) => !used && !userId);

  return (
    <div
      className={styles.scoreboard}
    >
      <table
        className={styles.scoreboard__table}
      >
        <thead>
          <tr>
            <th className={styles['scoreboard__table-heading']}>Player</th>
            <th className={styles['scoreboard__table-heading']}>Position</th>
            <th className={styles['scoreboard__table-heading']}>Last Turn</th>
            <th className={styles['scoreboard__table-heading']}>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const playerTurns = turns.filter(({ userId }) => userId === player);
            const playerScore = playerTurns.reduce((total, { score }) => total + score, 0);
            const { word: lastTurn } = playerTurns[playerTurns.length - 1] || {};

            return (
              <tr
                key={player}
              >
                <td className={styles['scoreboard__table-cell']}>{player}</td>
                <td className={styles['scoreboard__table-cell']} />
                <td className={styles['scoreboard__table-cell']}>{lastTurn}</td>
                <td className={styles['scoreboard__table-cell']}>{playerScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p
        className={styles.scoreboard__footer}
      >
        {`Remaining tiles: ${remainingTiles}`}
      </p>
      <p
        className={styles.scoreboard__footer}
      >
        {`Waiting for: ${getActiveUser()}`}
      </p>
    </div>
  );
};

export default ScoreBoard;
