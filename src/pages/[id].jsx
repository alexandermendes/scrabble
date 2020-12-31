import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

import Auth from '../components/Auth';
import Game from '../components/Game';
import { db } from '../db';
import { abort } from '../abort';
import useUser from '../hooks/useUser';

const useGame = (gameId) => {
  const [game, setGame] = useState();
  const [loadingGame, setLoadingGame] = useState(true);
  const { loadingUser, user } = useUser();

  useEffect(() => {
    if (loadingUser) {
      return;
    }

    const load = async () => {
      const { docs } = await db()
        .collection('games')
        .limit(1)
        .where('author', '==', user.uid)
        .where('__name__', '==', gameId)
        .get();

      setGame(docs[0]);
      setLoadingGame(false);
    };

    load();
  }, [loadingUser]);

  if (!loadingGame && !game) {
    abort(404);
  }

  return game;
};

const GamePage = ({
  gameId,
}) => {
  const game = useGame(gameId);

  if (!game) {
    return null; // TODO: loading spinner
  }

  return (
    <Auth>
      <Game />
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
