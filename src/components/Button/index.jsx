import React from 'react';
import {
  string,
  node,
  func,
  oneOf,
} from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

const Button = ({
  className,
  children,
  onClick,
  type,
}) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={cn(
      styles.button,
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
};

Button.propTypes = {
  className: string,
  onClick: func,
  children: node.isRequired,
  type: oneOf(['button', 'submit', 'reset']),
};

export default Button;
