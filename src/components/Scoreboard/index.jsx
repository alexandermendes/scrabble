import React, { useContext } from 'react';

import GameContext from '../../context/GameContext';

const ScoreBoard = () => {
  const { tiles } = useContext(GameContext);
  const { length: remainingTiles } = tiles.filter(({ used, inRack }) => !used && !inRack);

  return (
    <div>
      {remainingTiles}
    </div>
  );
};

export default ScoreBoard;
