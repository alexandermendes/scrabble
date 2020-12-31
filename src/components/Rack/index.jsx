import React, { useContext } from 'react';

import Tile from '../Tile';
import GameContext from '../../context/GameContext';

import styles from './styles.module.scss';

const Rack = () => {
  const { tiles } = useContext(GameContext);
  const rackTiles = tiles.filter(({ inRack, cellId }) => inRack && !cellId);

  return (
    <div
      className={styles.rack}
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

export default Rack;
