import React from 'react';
import cn from 'classnames';
import { func } from 'prop-types';

import Button from '../Button';

import styles from './styles.module.scss';

const Home = ({
  startGame,
}) => (
  <div
    className={cn(
      styles.home,
      'd-flex align-items-center justify-content-center',
    )}
  >
    <Button
      onClick={startGame}
      size="large"
      variant="secondary"
    >
      Start new game
    </Button>
  </div>
);

Home.propTypes = {
  startGame: func.isRequired,
};

export default Home;
