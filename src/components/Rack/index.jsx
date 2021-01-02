import React from 'react';
import cn from 'classnames';
import { string } from 'prop-types';

import Tile from '../Tile';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';

import styles from './styles.module.scss';

const Rack = ({
  className,
}) => {
  const user = useUser();
  const { game } = useGame();
  const { tiles } = game;
  const rackTiles = tiles.filter(({ userId, cellId }) => user && user.uid === userId && !cellId);

  return (
    <div
      className={cn(
        styles.rack,
        className,
      )}
    >
      {rackTiles.map((tile) => (
        <Tile
          className={styles.rack__tile}
          key={tile.id}
          id={tile.id}
          type={tile.type}
          letter={tile.letter}
          score={tile.score}
        />
      ))}
    </div>
  );
};

Rack.defaultProps = {
  className: null,
};

Rack.propTypes = {
  className: string,
};

export default Rack;
