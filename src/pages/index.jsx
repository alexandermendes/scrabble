import React from 'react';
import { useRouter } from 'next/router';

import Button from '../components/Button';
import useUser from '../hooks/useUser';
import { games } from '../store';

const HomePage = () => {
  const { user } = useUser();
  const router = useRouter();

  const startGame = async () => {
    if (!user) {
      return;
    }

    const docRef = await games.create(user);

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
