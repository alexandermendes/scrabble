import { useContext, useEffect } from 'react';
import deepmerge from 'deepmerge';

import { submitWord } from '../game/submit';
import { getRandomTiles } from '../game/tiles';
import { games } from '../store';
import { abort } from '../abort';
import GameContext from '../context/GameContext';
import useUser from './useUser';

/**
 * A hook to load and update a game.
 */
const useGame = () => {
  const { user: currentUser } = useUser();
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

  /**
   * Fill the rack for the current user.
   */
  const pickTiles = () => {
    const { tiles } = game;
    const currentRackTiles = tiles.filter(({ userId }) => currentUser.uid === userId);
    const nRequired = 7 - currentRackTiles.length;
    const newTiles = getRandomTiles(tiles, nRequired);

    if (!newTiles.length) {
      return;
    }

    updateTiles(newTiles.map((tile) => [tile.id, { userId: currentUser.uid }]));
  };

  /**
   * Submit the current user's word.
   */
  const takeTurn = () => {
    const { tiles } = game;
    const usedTiles = tiles.filter(({ userId, cellId }) => currentUser.uid === userId && !!cellId);

    const { word, score } = submitWord(tiles, usedTiles);

    if (!word) {
      return;
    }

    updateTiles(usedTiles.map((tile) => [tile.id, { used: true, userId: null }]));

    addTurn({
      userId: currentUser.uid,
      word,
      score,
    });

    pickTiles();

    // TODO: Switch turns
  };

  // Ensuring the current player is part of the game and has tiles
  // TODO: ask to join and limit players
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    (async () => {
      if (!(game.players.includes(currentUser.uid))) {
        await addPlayer(currentUser.uid);
      }

      pickTiles();
    })();
  }, [currentUser]);

  return {
    game,
    takeTurn,
    updateTiles,
    updateTile,
    getActiveUser,
  };
};

export default useGame;
