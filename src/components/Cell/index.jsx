import React from 'react';
import cn from 'classnames';
import { string, node } from 'prop-types';
import { useDrop } from 'react-dnd';

import styles from './styles.module.scss';
import useGame from '../../hooks/useGame';

const Cell = ({
  cellId,
  bonus,
  children,
}) => {
  const { game, updateTile } = useGame();
  const { tiles } = game;

  const [{ isOver }, ref] = useDrop({
    accept: 'tile',
    drop: ({ id }) => {
      updateTile(id, { cellId });
    },
    canDrop: () => !tiles.find((tile) => tile.cellId === cellId),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={ref}
      className={cn(
        styles.cell,
        bonus && styles['cell--bonus'],
        bonus && styles[`cell--${bonus}`],
        isOver && styles['cell--over'],
        children && styles['cell--filled'],
      )}
    >
      {children}
    </div>
  );
};

Cell.defaultProps = {
  bonus: null,
  children: null,
};

Cell.propTypes = {
  cellId: string.isRequired,
  bonus: string,
  children: node,
};

export default Cell;
