import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { string } from 'prop-types';

import Rack from '../Rack';
import Button from '../Button';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';

import styles from './styles.module.scss';

const GameFooter = ({
  className,
}) => {
  const currentUser = useUser();
  const {
    game,
    recallTiles,
    takeTurn,
  } = useGame();
  const rack = game.tiles.filter(({ userId, cellId, pendingExchange }) => (
    currentUser.uid === userId && !cellId && !pendingExchange
  ));
  const rackTileIds = JSON.stringify(rack.map(({ id }) => id).sort());

  const [sortedTiles, setSortedTiles] = useState([]);

  useEffect(() => {
    const ids = sortedTiles.map(({ id }) => id);

    // Maintain order when updating
    setSortedTiles(rack.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)));
  }, [rackTileIds]);

  /**
   * Swap two tiles.
   */
  const shift = (tileIdOne, tileIdTwo) => {
    if (!tileIdOne || !tileIdTwo) {
      return;
    }

    const indexOne = sortedTiles.findIndex((tile) => tile.id === tileIdOne);
    const indexTwo = sortedTiles.findIndex((tile) => tile.id === tileIdTwo);

    if (sortedTiles[indexOne] && sortedTiles[indexTwo]) {
      [
        sortedTiles[indexOne],
        sortedTiles[indexTwo],
      ] = [
        sortedTiles[indexTwo],
        sortedTiles[indexOne],
      ];
    }

    // Tile is not in the rack, it is probably being moved back from the board
    if (!sortedTiles[indexTwo]) {
      sortedTiles.splice(indexOne, 0, game.tiles.find((tile) => tile.id === tileIdTwo));
    }

    setSortedTiles([...sortedTiles]);
  };

  /**
   * Randomly shuffle tiles.
   */
  const shuffle = () => {
    for (let i = sortedTiles.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [sortedTiles[i], sortedTiles[j]] = [sortedTiles[j], sortedTiles[i]];
    }

    setSortedTiles([...sortedTiles]);
  };

  const hasTilesOnBoard = !!game.tiles
    .find(({ cellId, userId }) => userId === currentUser.uid && !!cellId);

  return (
    <div
      className={cn(
        styles['game-footer'],
        className,
      )}
    >
      <Button
        onClick={hasTilesOnBoard ? recallTiles : shuffle}
        variant="secondary"
        tile
      >
        {hasTilesOnBoard ? 'Recall' : 'Shuffle'}
      </Button>
      <Rack
        tiles={sortedTiles}
        shift={shift}
      />
      <Button
        onClick={takeTurn}
        variant="secondary"
        tile
      >
        Submit
      </Button>
    </div>
  );
};

GameFooter.defaultProps = {
  className: null,
};

GameFooter.propTypes = {
  className: string,
};

export default GameFooter;
