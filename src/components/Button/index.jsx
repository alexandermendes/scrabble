import React from 'react';
import { node, func } from 'prop-types';

import styles from './styles.module.scss';

const Button = ({
  children,
  onClick,
}) => (
  <button
    type="button"
    className={styles.button}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  onClick: func.isRequired,
  children: node.isRequired,
};

export default Button;
