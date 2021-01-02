import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

import { games } from '../store';
import Game from '../components/Game';
import GameContext from '../context/GameContext';
import { abort } from '../abort';

const GamePage = ({
  gameId,
}) => {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState();

  useEffect(() => {
    (async () => {
      setGame(await games.get(gameId));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // TODO: Loading spinner
  }

  if (!game) {
    abort(404);
  }

  return (
    <GameContext.Provider
      value={{
        game,
        gameId,
        setGame,
      }}
    >
      <Game />
    </GameContext.Provider>
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
