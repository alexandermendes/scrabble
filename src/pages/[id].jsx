import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

import { games } from '../store';
import Auth from '../components/Auth';
import Game from '../components/Game';
import useUser from '../hooks/useUser';
import GameContext from '../context/GameContext';
import { abort } from '../abort';

const GamePage = ({
  gameId,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState();

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      setGame(await games.get(gameId, user));
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return 'Loading...'; // TODO: Loading spinner
  }

  if (!game) {
    abort(404);
  }

  return (
    <Auth>
      <GameContext.Provider
        value={{
          game,
          gameId,
          setGame,
          user,
        }}
      >
        <Game />
      </GameContext.Provider>
    </Auth>
  );
};

export const getServerSideProps = async ({ params }) => ({
  props: {
    gameId: params.id,
  },
});

GamePage.propTypes = {
  gameId: string.isRequired,
};

export default GamePage;
