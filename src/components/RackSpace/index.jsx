import React from 'react';
import { string, func, node } from 'prop-types';
import { useDrop } from 'react-dnd';

const RackSpace = ({
  currentTileId,
  className,
  children,
  shift,
}) => {
  const [, ref] = useDrop({
    accept: 'tile',
    hover: (item) => {
      shift(currentTileId, item.id);
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
