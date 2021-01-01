import { useContext } from 'react';
import deepmerge from 'deepmerge';

import { games } from '../store';
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

  /**
   * Update the game state.
   */
  const updateGame = async () => {
    if (!game) {
      throw new Error('Game has not been loaded yet');
    }

    setGame({ ...game });

    await games.update(gameId, game);
  };

  /**
   * Update an array of tiles.
   */
  const updateTiles = async (arr) => {
    const { tiles } = game;

    arr.forEach(([tileId, data]) => {
      const updatedTile = tiles.find((tile) => tile.id === tileId);

      if (!updatedTile) {
        throw new Error(`No tile found with id ${tileId}`);
      }

      const tileIndex = tiles.findIndex((tile) => tile.id === updatedTile.id);

      game.tiles[tileIndex] = deepmerge(game.tiles[tileIndex], data);
    });

    return updateGame(game);
  };

  /**
   * Update a single tile.
   */
  const updateTile = async (tileId, data) => updateTiles([[tileId, data]]);

  /**
   * Add a turn.
   */
  const addTurn = async (data) => {
    game.turns.push(data);

    return updateGame(game);
  };

  /**
   * Add a player.
   */
  const addPlayer = async (data) => {
    game.players.push(data);

    return updateGame(game);
  };

  /**
   * Get the user whose turn it is.
   */
  const getActiveUser = () => {
    const { turns, players, owner } = game;

    if (!turns.length) {
      return owner;
    }

    const { userId: lastUser } = turns[turns.length - 1];
    const lastUserIndex = players.findIndex((player) => player === lastUser);
    const nextUser = lastUserIndex < players.length - 1
      ? players[lastUserIndex + 1]
      : players[0];

    return nextUser;
  };

  return {
    game,
    addTurn,
    addPlayer,
    updateTiles,
    updateTile,
    getActiveUser,
  };
};

export default useGame;
