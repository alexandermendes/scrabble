import React from 'react';
import { useDrag } from 'react-dnd';
import { string, number } from 'prop-types';
import cn from 'classnames';
import useGame from '../../hooks/useGame';

import styles from './styles.module.scss';
import useUser from '../../hooks/useUser';

const Tile = ({
  id,
  type,
  letter,
  score,
  className,
}) => {
  const { user } = useUser();
  const { game, getActiveUser } = useGame();
  const { tiles } = game;

  const [{ isDragging }, ref] = useDrag({
    item: { id, type },
    canDrag: () => getActiveUser() === user.uid && !tiles.find((tile) => tile.id === id).used,
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
      {letter === '□' ? '' : letter}
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
