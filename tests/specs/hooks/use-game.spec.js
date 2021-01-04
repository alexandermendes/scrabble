import { renderHook } from '@testing-library/react-hooks';
import withReactContent from 'sweetalert2-react-content';

import useGame from '../../../src/hooks/useGame';
import { games } from '../../../src/store/games';

import {
  createWrapper,
  createUser,
  createGame,
  createTile,
} from '../../utils';

jest.mock('../../../src/store/games');
jest.mock('sweetalert2-react-content', () => {
  const swal = { fire: jest.fn(() => ({ isConfirmed: false })) };

  return {
    __esModule: true,
    default: jest.fn(() => swal),
  };
});

const playerOne = createUser('Joe');
const playerTwo = createUser('Jane');

const game = createGame(playerOne, { players: [playerOne, playerTwo] });

const wrapper = createWrapper({
  userContext: playerOne,
  gameContext: {
    game,
    gameId: 'abc123',
    setGame: jest.fn(),
  },
});

describe('useGame hook', () => {
  beforeEach(() => {
    withReactContent().fire.mockReturnValue({ isConfirmed: false });
  });

  describe('game', () => {
    it('returns the active game', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      const { game: activeGame } = result.current;

      expect(activeGame).toEqual(game);
    });
  });

  describe('getActivePlayer', () => {
    it('returns the first player if no turns have been taken', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      const { getActivePlayer } = result.current;

      expect(getActivePlayer()).toEqual(playerOne);
    });

    it('returns the next player if a turn has been taken', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper({
          userContext: playerOne,
          gameContext: {
            game: {
              ...game,
              turns: [
                {
                  userId: playerOne.uid,
                },
              ],
            },
            gameId: 'abc123',
            setGame: jest.fn(),
          },
        }),
      });

      const { getActivePlayer } = result.current;

      expect(getActivePlayer()).toEqual(playerTwo);
    });

    it('returns the first player if the previous player was the last in the list', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper({
          userContext: playerOne,
          gameContext: {
            game: {
              ...game,
              turns: [
                {
                  userId: playerOne.uid,
                },
                {
                  userId: playerTwo.uid,
                },
              ],
            },
            gameId: 'abc123',
            setGame: jest.fn(),
          },
        }),
      });

      const { getActivePlayer } = result.current;

      expect(getActivePlayer()).toEqual(playerOne);
    });
  });

  describe('exchangeTiles', () => {
    it('does nothing if no tiles are waiting to be exchanged', async () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      const { exchangeTiles } = result.current;

      await exchangeTiles();

      expect(games.update).not.toHaveBeenCalled();
    });

    it('exchanges tiles if the user confirms', async () => {
      withReactContent().fire.mockReturnValue({ isConfirmed: true });

      const tileOne = createTile('A', { userId: playerOne.uid, pendingExchange: true });
      const tileTwo = createTile('B', { userId: playerOne.uid, pendingExchange: true });
      const tileThree = createTile('C', { userId: playerOne.uid, cellId: '1:1' });

      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper({
          userContext: playerOne,
          gameContext: {
            game: {
              ...game,
              tiles: [
                tileOne,
                tileTwo,
                tileThree,
              ],
            },
            gameId: 'abc123',
            setGame: jest.fn(),
          },
        }),
      });

      const { exchangeTiles } = result.current;

      await exchangeTiles();

      const lastCall = games.update.mock.calls[games.update.mock.calls.length - 1];
      const newGame = {
        ...game,
        tiles: [
          {
            ...tileOne,
            userId: null,
            cellId: null,
            pendingExchange: false,
          },
          {
            ...tileTwo,
            userId: null,
            cellId: null,
            pendingExchange: false,
          },
          {
            ...tileThree,
            cellId: null,
          },
        ],
        turns: [
          {
            userId: playerOne.uid,
            word: '-',
            score: 0,
          },
        ],
      };

      expect(games.update).toHaveBeenCalledTimes(1);
      expect(lastCall).toEqual(['abc123', newGame]);
    });

    it('does not exchange tiles if the user does not confirm', async () => {
      withReactContent().fire.mockReturnValue({ isConfirmed: false });

      const tileOne = createTile('A', { userId: playerOne.uid, pendingExchange: true });
      const tileTwo = createTile('B', { userId: playerOne.uid, pendingExchange: true });
      const tileThree = createTile('C', { userId: playerOne.uid, cellId: '1:1' });

      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper({
          userContext: playerOne,
          gameContext: {
            game: {
              ...game,
              tiles: [
                tileOne,
                tileTwo,
                tileThree,
              ],
            },
            gameId: 'abc123',
            setGame: jest.fn(),
          },
        }),
      });

      const { exchangeTiles } = result.current;

      await exchangeTiles();

      const lastCall = games.update.mock.calls[games.update.mock.calls.length - 1];
      const newGame = {
        ...game,
        tiles: [
          {
            ...tileOne,
            pendingExchange: false,
          },
          {
            ...tileTwo,
            pendingExchange: false,
          },
          tileThree,
        ],
      };

      expect(games.update).toHaveBeenCalledTimes(1);
      expect(lastCall).toEqual(['abc123', newGame]);
    });

    it('does not attempt to exchange other users tiles', async () => {
      withReactContent().fire.mockReturnValue({ isConfirmed: true });

      const tileOne = createTile('A', { userId: playerOne.uid, pendingExchange: true, cellId: '1:1' });

      // It shouldn't happen that another user can still have tiles pending or
      // on the board, but we can test against it anyway
      const tileTwo = createTile('B', { userId: playerTwo.uid, pendingExchange: true });
      const tileThree = createTile('C', { userId: playerTwo.uid, cellId: '1:2' });

      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper({
          userContext: playerOne,
          gameContext: {
            game: {
              ...game,
              tiles: [
                tileOne,
                tileTwo,
                tileThree,
              ],
            },
            gameId: 'abc123',
            setGame: jest.fn(),
          },
        }),
      });

      const { exchangeTiles } = result.current;

      await exchangeTiles();

      const lastCall = games.update.mock.calls[games.update.mock.calls.length - 1];
      const newGame = {
        ...game,
        tiles: [
          {
            ...tileOne,
            userId: null,
            cellId: null,
            pendingExchange: false,
          },
          tileTwo,
          tileThree,
        ],
        turns: [
          {
            userId: playerOne.uid,
            word: '-',
            score: 0,
          },
        ],
      };

      expect(games.update).toHaveBeenCalledTimes(1);
      expect(lastCall).toEqual(['abc123', newGame]);
    });
  });
});
