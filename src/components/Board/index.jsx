import React from 'react';

import { cells } from '../../game/cells';
import Cell from '../Cell';
import Tile from '../Tile';

import styles from './styles.module.scss';
import useGame from '../../hooks/useGame';

const Board = () => {
  const { game } = useGame();
  const { tiles } = game;

  return (
    <div
      className={styles.board}
    >
      {cells.map((row) => row.map((cell) => {
        const tile = tiles.find(({ cellId }) => cellId === cell.id) || null;

        return (
          <Cell
            key={cell.id}
            cellId={cell.id}
            bonus={cell.bonus}
          >
            {tile && (
              <Tile
                key={tile.id}
                id={tile.id}
                type={tile.type}
                letter={tile.letter}
                score={tile.score}
              />
            )}
          </Cell>
        );
      }))}
    </div>
  );
};

export default Board;
