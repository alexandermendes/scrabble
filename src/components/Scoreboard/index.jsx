import React, { useContext } from 'react';

import GameContext from '../../context/GameContext';

const ScoreBoard = () => {
  const { game } = useContext(GameContext);
  const { tiles } = game;
  const { length: remainingTiles } = tiles.filter(({ used, inRack }) => !used && !inRack);

  return (
    <div>
      {remainingTiles}
    </div>
  );
};

export default ScoreBoard;
