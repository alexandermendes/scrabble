import { useContext, useEffect } from 'react';
import deepmerge from 'deepmerge';

import { submitWord } from '../game/submit';
import { getRandomTiles } from '../game/tiles';
import { games } from '../store';
import GameContext from '../context/GameContext';
import useUser from './useUser';

/**
 * A hook to load and update a game.
 */
const useGame = () => {
  const currentUser = useUser();
  const { game, gameId, setGame } = useContext(GameContext);

  if (!game) {
    const err = new Error('Game not found');
    err.statusCode = 404;
    throw err;
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
  const getActivePlayer = () => {
    const { turns, players } = game;
    const firstPlayer = players[0];

    if (!turns.length) {
      return firstPlayer;
    }

    const { userId: lastUserId } = turns[turns.length - 1];
    const lastUserIndex = players.findIndex((player) => player.uid === lastUserId);
    const nextUser = lastUserIndex < players.length - 1
      ? players[lastUserIndex + 1]
      : firstPlayer;

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
    let word;
    let score;

    try {
      ({ word, score } = submitWord(game, tiles, usedTiles));
    } catch (err) {
      // TODO: Replace with a prettier modal
      // eslint-disable-next-line no-alert
      window.alert(err.message);

      return;
    }

    if (!word) {
      throw new Error('Failed to submit word.');
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

  /**
   * Move tiles back to the current user's rack.
   */
  const recallTiles = () => {
    const usedTiles = game.tiles.filter(({ userId }) => currentUser.uid === userId);

    updateTiles(usedTiles.map((tile) => [tile.id, { cellId: null }]));
  };

  // Ensuring the current player is part of the game and has tiles
  // TODO: ask to join and limit players
  useEffect(() => {
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    (async () => {
      if (!game.players.find((player) => player.uid === currentUser.uid)) {
        // TODO: Create some model to sync this with the other place it's used
        await addPlayer({
          uid: currentUser.uid,
          displayName: currentUser.uid,
          email: currentUser.email,
        });
      }

      pickTiles();
    })();
  }, [currentUser]);

  return {
    game,
    takeTurn,
    recallTiles,
    updateTiles,
    updateTile,
    getActivePlayer,
  };
};

export default useGame;
