import React from 'react';
import {
  string,
  node,
  func,
  oneOf,
  bool,
} from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

const Button = ({
  className,
  children,
  onClick,
  type,
  size,
  secondary,
  tile,
}) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={cn(
      styles.button,
      styles[`button--${size}`],
      secondary && styles['button--secondary'],
      tile && styles['button--tile'],
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  className: null,
  type: 'submit',
  onClick: null,
  size: 'regular',
  secondary: false,
  tile: false,
};

Button.propTypes = {
  className: string,
  onClick: func,
  children: node.isRequired,
  secondary: bool,
  tile: bool,
  type: oneOf(['button', 'submit', 'reset']),
  size: oneOf(['large', 'regular', 'small']),
};

export default Button;
