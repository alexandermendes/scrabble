import React from 'react';

import Home from '../components/Home';
import useNewGame from '../hooks/useNewGame';

const HomePage = () => {
  const createNewGame = useNewGame();

  return (
    <Home
      startGame={createNewGame}
    />
  );
};

export default HomePage;
