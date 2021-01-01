import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

import Auth from '../components/Auth';
import Game from '../components/Game';
import { db } from '../db';
import { abort } from '../abort';
import useUser from '../hooks/useUser';
import GameContext from '../context/GameContext';

const useGame = (gameId, user) => {
  const [game, setGame] = useState();
  const [loadingGame, setLoadingGame] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const load = async () => {
      const { docs, empty } = await db()
        .collection('games')
        .limit(1)
        .where('author', '==', user.uid)
        .where('__name__', '==', gameId)
        .get();

      if (!empty) {
        setGame(docs[0].data());
      }

      setLoadingGame(false);
    };

    load();
  }, [user]);

  if (!loadingGame && !game) {
    abort(404);
  }

  const updateGame = async (newGameData) => {
    if (!game) {
      throw new Error('Game has not been loaded yet');
    }

    setGame(newGameData);

    await db()
      .collection('games')
      .doc(gameId)
      .set(newGameData);
  };

  return [game, updateGame];
};

const GamePage = ({
  gameId,
}) => {
  const { user } = useUser();
  const [game, setGame] = useGame(gameId, user);

  if (!game) {
    return null; // TODO: loading spinner
  }

  return (
    <Auth>
      <GameContext.Provider
        value={{
          game,
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
