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
    <div
      className="d-flex align-items-center justify-content-center h-100"
    >
      <Button
        onClick={startGame}
        size="large"
      >
        Start new game
      </Button>
    </div>
  );
};

export default HomePage;
