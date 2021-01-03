import React, { useState } from 'react';
import {
  string,
  node,
  oneOf,
  func,
} from 'prop-types';
import cn from 'classnames';

import styles from './styles.module.scss';

const Drawer = ({
  id,
  children,
  label,
  position,
  className,
  onClose,
  onOpen,
}) => {
  const [open, setOpen] = useState(false);

  const handleDrawerClick = () => {
    const callback = open ? onClose : onOpen;

    if (callback) {
      callback();
    }

    setOpen(!open);
  };

  return (
    <div
      className={cn(
        className,
        styles.drawer,
        styles[`drawer--${position}`],
        open && styles['drawer--open'],
      )}
    >
      <div
        className={styles.drawer__container}
      >
        <button
          className={styles.drawer__handle}
          type="button"
          onClick={handleDrawerClick}
          aria-controls={id}
          aria-expanded={open}
        >
          {label}
        </button>
        <div
          className={styles.drawer__contents}
          aria-labelledby={id}
          role="region"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Drawer.defaultProps = {
  className: null,
  onClose: null,
  onOpen: null,
};

Drawer.propTypes = {
  id: string.isRequired,
  children: node.isRequired,
  label: string.isRequired,
  className: string,
  onClose: func,
  onOpen: func,
  position: oneOf(['top', 'bottom']).isRequired,
};

export default Drawer;
