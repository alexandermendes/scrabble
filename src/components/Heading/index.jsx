import React from 'react';
import cn from 'classnames';
import { string, node, oneOf } from 'prop-types';

import styles from './styles.module.scss';

const Heading = ({
  children,
  size,
  className,
}) => {
  const Component = `h${size}`;

  return (
    <Component
      className={cn(
        styles.heading,
        className,
      )}
    >
      {children}
    </Component>
  );
};

Heading.defaultProps = {
  className: null,
};

Heading.propTypes = {
  className: string,
  children: node.isRequired,
  size: oneOf([1, 2, 3, 4, 5, 6]).isRequired,
};

export default Heading;
