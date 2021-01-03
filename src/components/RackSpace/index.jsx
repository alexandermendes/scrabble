import React from 'react';
import { string, func, node } from 'prop-types';
import { useDrop } from 'react-dnd';

import useGame from '../../hooks/useGame';

const RackSpace = ({
  currentTileId,
  className,
  children,
  shift,
}) => {
  const { game, updateTile } = useGame();

  const [, ref] = useDrop({
    accept: 'tile',
    hover: (item) => {
      shift(currentTileId, item.id);
    },
    drop: ({ id }) => {
      if (game.tiles.find((tile) => tile.id === id)?.cellId) {
        updateTile(id, { cellId: null });
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
