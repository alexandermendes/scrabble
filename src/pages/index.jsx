import React from 'react';
import { useRouter } from 'next/router';

import Button from '../components/Button';
import useUser from '../hooks/useUser';
import { db } from '../db';
import { getTiles } from '../data/tiles';

const HomePage = () => {
  const { user } = useUser();
  const router = useRouter();

  const startGame = async () => {
    const docRef = await db().collection('games').add({
      author: user.uid,
      players: [user.uid],
      tiles: getTiles(),
      scores: {},
    });

    router.push({
      pathname: '/[id]',
      query: { id: docRef.id },
    });
  };

  return (
    <Button
      onClick={startGame}
    >
      Start new game
    </Button>
  );
};

export default HomePage;
