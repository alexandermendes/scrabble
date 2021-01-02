import React from 'react';
import { useRouter } from 'next/router';

import Button from '../components/Button';
import useUser from '../hooks/useUser';
import { games } from '../store';

const HomePage = () => {
  const currentUser = useUser();
  const router = useRouter();

  const startGame = async () => {
    if (!currentUser) {
      return;
    }

    const docRef = await games.create(currentUser);

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
