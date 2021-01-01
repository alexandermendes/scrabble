import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { string, number } from 'prop-types';
import cn from 'classnames';
import useGame from '../../hooks/useGame';

import styles from './styles.module.scss';

const Tile = ({
  id,
  type,
  letter,
  score,
  className,
}) => {
  const { game } = useGame();
  const { tiles } = game;

  const [{ isDragging }, ref] = useDrag({
    item: { id, type },
    canDrag: () => !tiles.find((tile) => tile.id === id).used,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={ref}
      className={cn(
        styles.tile,
        className,
        isDragging && styles['tile--dragging'],
      )}
    >
      {letter}
      {!!score && (
        <span
          className={styles.tile__score}
        >
          {score}
        </span>
      )}
    </div>
  );
};

Tile.defaultProps = {
  className: null,
};

Tile.propTypes = {
  id: string.isRequired,
  type: string.isRequired,
  letter: string.isRequired,
  score: number.isRequired,
  className: string,
};

export default Tile;
