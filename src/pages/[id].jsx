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
    (async () => {
      setGame(await games.get(gameId));

      games.listen(gameId, (newGame) => {
        setGame(newGame);
      });

      setLoading(false);
    })();
  }, []);

  return (
    <PageTransition
      loaded={!loading}
    >
      <GameContext.Provider
        value={{
          game,
          gameId,
          setGame,
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
