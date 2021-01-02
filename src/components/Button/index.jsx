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
}) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={cn(
      styles.button,
      styles[`button--${size}`],
      secondary && styles['button--secondary'],
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
};

Button.propTypes = {
  className: string,
  onClick: func,
  children: node.isRequired,
  secondary: bool,
  type: oneOf(['button', 'submit', 'reset']),
  size: oneOf(['large', 'regular', 'small']),
};

export default Button;
