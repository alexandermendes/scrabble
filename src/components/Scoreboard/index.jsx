import React, { useContext } from 'react';

import BoardContext from '../../BoardContext';

const ScoreBoard = () => {
  const { tiles } = useContext(BoardContext);
  const { length: remainingTiles } = tiles.filter(({ used, inRack }) => !used && !inRack);

  return (
    <div>
      {remainingTiles}
    </div>
  );
};

export default ScoreBoard;
