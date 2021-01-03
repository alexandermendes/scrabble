import React from 'react';
import { string, func, node } from 'prop-types';
import { useDrop } from 'react-dnd';

import { TILE_KEY } from '../../game/tiles';
import useGame from '../../hooks/useGame';

const RackSpace = ({
  currentTileId,
  className,
  children,
  shift,
}) => {
  const { game, updateTile } = useGame();

  const [, ref] = useDrop({
    accept: TILE_KEY,
    hover: (item) => {
      shift(currentTileId, item.id);
    },
    drop: ({ id }) => {
      const droppedTile = game.tiles.find((tile) => tile.id === id);

      if (droppedTile.cellId || droppedTile.pendingExchange) {
        updateTile(id, { cellId: null, pendingExchange: false });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <>
      <div
        ref={ref}
        className={className}
      >
        {children}
      </div>
    </>
  );
};

RackSpace.defaultProps = {
  className: null,
};

RackSpace.propTypes = {
  currentTileId: string.isRequired,
  shift: func.isRequired,
  children: node.isRequired,
  className: string,
};

export default RackSpace;
