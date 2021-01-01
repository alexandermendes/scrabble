import { useContext } from 'react';
import deepmerge from 'deepmerge';

import { games } from '../db';
import { abort } from '../abort';
import GameContext from '../context/GameContext';

/**
 * A hook to load and update a game.
 */
const useGame = () => {
  const { game, gameId, setGame } = useContext(GameContext);

  if (!game) {
    abort(404);
  }

  const updateGame = async () => {
    if (!game) {
      throw new Error('Game has not been loaded yet');
    }

    setGame({ ...game });

    await games.update(gameId, game);
  };

  const updateTile = async (tileId, data) => {
    const { tiles } = game;
    const updatedTile = tiles.find((tile) => tile.id === tileId);

    if (!updatedTile) {
      throw new Error(`No tile found with id ${tileId}`);
    }

    const tileIndex = tiles.findIndex((tile) => tile.id === updatedTile.id);

    game.tiles[tileIndex] = deepmerge(game.tiles[tileIndex], data);

    return updateGame(game);
  };

  const addTurn = async (data) => {
    game.turns.push(data);

    return updateGame(game);
  };

  return { game, addTurn, updateTile };
};

export default useGame;
