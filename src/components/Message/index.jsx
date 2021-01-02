import React from 'react';
import { string, oneOf, node } from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

const Message = ({
  className,
  children,
  type,
}) => (
  <p
    className={cn(
      styles.message,
      styles[`message--${type}`],
      className,
    )}
  >
    {children}
  </p>
);

Message.defaultProps = {
  className: null,
  type: 'info',
};

Message.propTypes = {
  children: node.isRequired,
  type: oneOf(['error', 'success']),
  className: string,
};

export default Message;
