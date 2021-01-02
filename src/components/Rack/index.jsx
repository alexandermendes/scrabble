import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { string } from 'prop-types';

import Tile from '../Tile';
import RackSpace from '../RackSpace';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';

import styles from './styles.module.scss';

const Rack = ({
  className,
}) => {
  const currentUser = useUser();
  const { game } = useGame();
  const rack = game.tiles.filter(({ userId, cellId }) => currentUser.uid === userId && !cellId);
  const rackTileIds = JSON.stringify(rack.map(({ id }) => id).sort());
  const [sortedTiles, setSortedTiles] = useState([]);

  useEffect(() => {
    setSortedTiles(rack);
  }, [rackTileIds]);

  const shift = (tileIdOne, tileIdTwo) => {
    if (!tileIdOne || !tileIdTwo) {
      return;
    }

    const indexOne = sortedTiles.findIndex((tile) => tile.id === tileIdOne);
    const indexTwo = sortedTiles.findIndex((tile) => tile.id === tileIdTwo);

    // TODO: Figure out how to move tiles back to the rack
    if (!sortedTiles[indexOne] || !sortedTiles[indexTwo]) {
      return;
    }

    [sortedTiles[indexOne], sortedTiles[indexTwo]] = [sortedTiles[indexTwo], sortedTiles[indexOne]];

    setSortedTiles([...sortedTiles]);
  };

  return (
    <div
      className={cn(
        styles.rack,
        className,
      )}
    >
      {sortedTiles.map((tile) => (
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
          />
        </RackSpace>
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
