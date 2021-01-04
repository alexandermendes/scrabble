import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

import { games } from '../store';
import Game from '../components/Game';
import PageTransition from '../components/PageTransition';
import GameContext from '../context/GameContext';

const GamePage = ({
  gameId,
}) => {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState();

  useEffect(() => {
    setLoading(true);

    (async () => {
      setGame(await games.get(gameId));

      games.listen(gameId, (newGame) => {
        // TODO: Don't duplicate fire on first load
        setGame(newGame);
      });

      setLoading(false);
    })();
  }, [gameId]);

  return (
    <PageTransition
      loaded={!loading}
    >
      <GameContext.Provider
        value={{
          game,
          gameId,
        }}
      >
        <Game />
      </GameContext.Provider>
    </PageTransition>
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
