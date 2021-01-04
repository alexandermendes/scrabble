import React from 'react';
import {
  act,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { games } from '../../../src/store/games';
import GamePage from '../../../src/pages/[id]';
import { createUser, createGame, createWrapper } from '../../utils';

jest.mock('../../../src/store/games');

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

describe('Game Page', () => {
  beforeEach(() => {
    games.get.mockResolvedValue(game);
  });

  it('makes the expected call to load the game', async () => {
    await act(async () => {
      render(<GamePage gameId="abc123" />, { wrapper });
    });

    expect(games.get).toHaveBeenCalledWith('abc123');
  });

  it('reloads the game if the ID changes', async () => {
    let component;

    await act(async () => {
      component = render(<GamePage gameId="abc123" />, { wrapper });
    });

    await waitForElementToBeRemoved(component.getByRole('progressbar'));

    expect(games.get).toHaveBeenCalledWith('abc123');

    await act(async () => {
      component.rerender(<GamePage gameId="abc456" />, { wrapper });
    });

    expect(games.get).toHaveBeenCalledWith('abc456');
  });

  it('renders the the game', async () => {
    let component;

    await act(async () => {
      component = render(<GamePage gameId="abc123" />, { wrapper });
    });

    await waitForElementToBeRemoved(component.getByRole('progressbar'));

    const heading = component.getByRole('heading', { level: 1 });

    expect(heading.innerHTML).toBe('Game with 2 players: Joe,Jane');
  });

  it('listens for changes to the game data', async () => {
    let component;

    await act(async () => {
      component = render(<GamePage gameId="abc123" />, { wrapper });
    });

    await waitForElementToBeRemoved(component.getByRole('progressbar'));

    const [gameId, callback] = games.listen.mock.calls[0];

    expect(gameId).toBe('abc123');
    expect(callback).toEqual(expect.any(Function));
    expect(component.getByRole('heading', { level: 1 }).innerHTML).toEqual(
      expect.stringContaining('Game with 2 players'),
    );

    act(() => {
      callback({
        ...game,
        players: [
          ...game.players,
          createUser('Fred'),
        ],
      });
    });

    expect(component.getByRole('heading', { level: 1 }).innerHTML).toEqual(
      expect.stringContaining('Game with 3 players'),
    );
  });
});
