import React from 'react';
import cn from 'classnames';
import { array, func, string } from 'prop-types';

import Tile from '../Tile';
import RackSpace from '../RackSpace';

import styles from './styles.module.scss';

const Rack = ({
  className,
  tiles,
  shift,
}) => (
  <div
    className={cn(
      styles.rack,
      className,
    )}
  >
    {tiles.map((tile) => (
      <RackSpace
        className={styles.rack__tile}
        key={tile.id}
        currentTileId={tile.id}
        shift={shift}
      >
        <Tile
          id={tile.id}
          type={tile.type}
          letter={tile.letter}
          score={tile.score}
          hide={!!(tile.cellId || tile.pendingExchange)} // When dragging back from the board
        />
      </RackSpace>
    ))}
  </div>
);

Rack.defaultProps = {
  className: null,
};

Rack.propTypes = {
  className: string,
  tiles: array.isRequired,
  shift: func.isRequired,
};

export default Rack;
