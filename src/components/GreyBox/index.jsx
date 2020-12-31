import React from 'react';
import { node } from 'prop-types';

import styles from './styles.module.scss';

const GreyBox = ({
  children,
}) => (
  <div
    className={styles['grey-box']}
  >
    <div
      className={styles['grey-box__container']}
    >
      {children}
    </div>
  </div>
);

GreyBox.propTypes = {
  children: node.isRequired,
};

export default GreyBox;
