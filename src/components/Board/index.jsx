import React, { useContext } from 'react';

import { cells } from '../../data/cells';
import Cell from '../Cell';
import Tile from '../Tile';
import BoardContext from '../../context/BoardContext';

import styles from './styles.module.scss';

const Board = () => {
  const { tiles } = useContext(BoardContext);

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
