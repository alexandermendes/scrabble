import React from 'react';

import Button from '../components/Button';
import Game from '../components/Game';

const startGame = () => {

};

const HomePage = () => (
  <Button
    onClick={startGame}
  >
    Start new game
  </Button>
);

export default HomePage;
