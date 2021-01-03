import React from 'react';
import cn from 'classnames';
import { string, node } from 'prop-types';
import { useDrop } from 'react-dnd';
import SweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { TILE_KEY } from '../../game/tiles';
import styles from './styles.module.scss';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';

const Swal = withReactContent(SweetAlert);

const Cell = ({
  cellId,
  bonus,
  display,
  children,
}) => {
  const currentUser = useUser();
  const { game, updateTile, getActivePlayer } = useGame();
  const { tiles } = game;

  const [{ isOver }, ref] = useDrop({
    accept: TILE_KEY,
    drop: ({ id }) => {
      const activePlayer = getActivePlayer();

      if (activePlayer.uid !== currentUser.uid) {
        Swal.fire({
          html: (
            <>
              <p
                className="mb-3"
              >
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                You can only place tiles on the board when it's your go.
              </p>
              <p>
                {`Waiting for ${activePlayer.displayName || activePlayer.email} to take their turn.`}
              </p>
            </>
          ),
        });

        return;
      }

      updateTile(id, { cellId, pendingExchange: false });
    },
    canDrop: () => (
      !tiles.find((tile) => tile.cellId === cellId)
    ),
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && getActivePlayer().uid === currentUser.uid,
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
      {display && (
        <span className={styles.cell__text}>
          {display}
        </span>
      )}
      {children}
    </div>
  );
};

Cell.defaultProps = {
  bonus: null,
  display: null,
  children: null,
};

Cell.propTypes = {
  cellId: string.isRequired,
  bonus: string,
  display: string,
  children: node,
};

export default Cell;
