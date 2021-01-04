import { useContext, useEffect } from 'react';
import deepmerge from 'deepmerge';
import SweetAlert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { submitWord, UserSubmissionError } from '../game/submit';
import { getRandomTiles } from '../game/tiles';
import { games } from '../store';
import GameContext from '../context/GameContext';
import useUser from './useUser';

const Swal = withReactContent(SweetAlert);

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
   * Get the tiles the user has placed on the board.
   */
  const getUserTiles = () => game.tiles.filter(({ userId }) => currentUser.uid === userId);

  /**
   * Update the game state.
   */
  const updateGame = async (newGame) => {
    if (!game) {
      throw new Error('Game has not been loaded yet');
    }

    setGame(newGame);

    await games.update(gameId, newGame);
  };

  /**
   * Update an array of tiles.
   */
  const updateTiles = async (arr, pushData = true) => {
    const newGame = { ...game };
    const { tiles } = newGame;

    arr.forEach(([tileId, data]) => {
      const updatedTile = tiles.find((tile) => tile.id === tileId);

      if (!updatedTile) {
        throw new Error(`No tile found with id ${tileId}`);
      }

      const tileIndex = tiles.findIndex((tile) => tile.id === updatedTile.id);

      newGame.tiles[tileIndex] = deepmerge(newGame.tiles[tileIndex], data);
    });

    if (!pushData) {
      return null;
    }

    return updateGame(newGame);
  };

  /**
   * Update a single tile.
   */
  const updateTile = async (tileId, data) => updateTiles([[tileId, data]]);

  /**
   * Add a turn.
   */
  const addTurn = async (turn) => updateGame({
    ...game,
    turns: [
      ...game.turns,
      turn,
    ],
  });

  /**
   * Add a player.
   */
  const addPlayer = async (player) => updateGame({
    ...game,
    players: [
      ...game.players,
      player,
    ],
  });

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
    const currentRackTiles = getUserTiles();
    const nRequired = 7 - currentRackTiles.length;
    const newTiles = getRandomTiles(tiles, nRequired);

    if (!newTiles.length) {
      return;
    }

    updateTiles(newTiles.map((tile) => [tile.id, { userId: currentUser.uid }]));
  };

  /**
   * Exchange tiles and submit that as the user's turn.
   */
  const exchangeTiles = async () => {
    const userTiles = getUserTiles();
    const exchangedTiles = userTiles.filter(({ userId, pendingExchange }) => (
      currentUser.uid === userId && pendingExchange
    ));
    const exchangedTileIds = exchangedTiles.map(({ id }) => id);

    if (!exchangedTileIds.length) {
      return false;
    }

    const result = await Swal.fire({
      text: `Do you want to exchange ${exchangedTileIds.length} tile${exchangedTileIds.length === 1 ? '' : 's'}?`,
      showCancelButton: true,
      icon: 'question',
    });

    if (result.isConfirmed) {
      const newTiles = getRandomTiles(game.tiles, exchangedTileIds.length);

      updateTiles([
        ...newTiles.map((tile) => [tile.id, { userId: currentUser.uid }]),
        ...userTiles.map((tile) => [tile.id, {
          cellId: null, // So tiles not being exchanged still get moved back off the board
          userId: exchangedTileIds.includes(tile.id) ? null : tile.userId,
          pendingExchange: false,
        }]),
      ], false);

      addTurn({
        userId: currentUser.uid,
        word: '-',
        score: 0,
      });

      return true;
    }

    updateTiles(exchangedTiles.map((tile) => [tile.id, { pendingExchange: false }]));

    return true;
  };

  /**
   * Move tiles back to the current user's rack.
   */
  const recallTiles = () => {
    const userTiles = getUserTiles();

    updateTiles(userTiles.map((tile) => [tile.id, { cellId: null, pendingExchange: false }]));
  };

  /**
   * Submit the current user's word.
   */
  const takeTurn = async () => {
    const exchanged = await exchangeTiles();

    // In case submit was hit in an attempt to exchange
    if (exchanged) {
      return;
    }

    const { tiles } = game;
    const usedTiles = tiles.filter(({ userId, cellId }) => currentUser.uid === userId && !!cellId);
    let word;
    let score;

    try {
      ({ word, score } = submitWord(game, tiles, usedTiles));
    } catch (err) {
      if (err instanceof UserSubmissionError) {
        Swal.fire({ text: err.message });

        return;
      }

      throw err;
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
  }, [currentUser, gameId]);

  return {
    game,
    takeTurn,
    recallTiles,
    updateTiles,
    updateTile,
    exchangeTiles,
    getActivePlayer,
  };
};

export default useGame;
