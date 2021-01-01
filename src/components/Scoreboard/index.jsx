import React, { useContext } from 'react';

import GameContext from '../../context/GameContext';

const ScoreBoard = () => {
  const { game } = useContext(GameContext);
  const { tiles, players, scores = {} } = game;
  const { length: remainingTiles } = tiles.filter(({ used, inRack }) => !used && !inRack);

  return (
    <div>
      {players.map((player) => (
        <p>
          {player}
          {': '}
          {scores[player] || 0}
        </p>
      ))}
      {`Remaining tiles: ${remainingTiles}`}
    </div>
  );
};

export default ScoreBoard;
