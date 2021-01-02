import React from 'react';
import cn from 'classnames';
import { string } from 'prop-types';

import { cells } from '../../game/cells';
import Cell from '../Cell';
import Tile from '../Tile';

import styles from './styles.module.scss';
import useGame from '../../hooks/useGame';
import useTileSize from '../../hooks/useTileSize';

const Board = ({
  className,
}) => {
  const { game } = useGame();
  const { tiles } = game;
  const {
    boardRef,
    tileSize,
    gridGap,
  } = useTileSize();

  return (
    <div
      className={cn(
        styles.board,
        className,
      )}
      ref={boardRef}
    >
      <div
        className={styles.board__inner}
        style={{
          gridTemplateColumns: `repeat(15, ${tileSize}px)`,
          gridGap: `${gridGap}px`,
          padding: `${gridGap}px`,
        }}
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
    </div>
  );
};

Board.defaultProps = {
  className: null,
};

Board.propTypes = {
  className: string,
};

export default Board;
