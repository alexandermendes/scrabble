import React from 'react';
import { useDrop } from 'react-dnd';

import { TILE_KEY } from '../../game/tiles';
import useGame from '../../hooks/useGame';
import useUser from '../../hooks/useUser';
import Drawer from '../Drawer';
import Tile from '../Tile';

import styles from './styles.module.scss';

const ExchangeDrawer = () => {
  const currentUser = useUser();
  const {
    game,
    updateTile,
    exchangeTiles,
  } = useGame();
  const tilesToExchange = game
    .tiles
    .filter(({ userId, pendingExchange }) => currentUser.uid === userId && pendingExchange);

  const [, exchangeDrawerRef] = useDrop({
    accept: TILE_KEY,
    drop: ({ id }) => {
      updateTile(id, { cellId: null, pendingExchange: true });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Drawer
      id="exchange-drawer"
      label="Exchange Tiles"
      position="bottom"
      className={styles['exchange-drawer']}
      onClose={exchangeTiles}
    >
      <p
        className={styles['exchange-drawer__text']}
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Drag the tiles you want to exchange here and close the drawer when you're ready.
      </p>
      <div
        ref={exchangeDrawerRef}
        className={styles['exchange-drawer__contents']}
      >
        {tilesToExchange.map((tile) => (
          <Tile
            key={tile.id}
            id={tile.id}
            type={tile.type}
            letter={tile.letter}
            score={tile.score}
          />
        ))}
      </div>
    </Drawer>
  );
};

export default ExchangeDrawer;
