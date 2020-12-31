import React from 'react';
import { node, string } from 'prop-types';
import NextLink from 'next/link';

import styles from './styles.module.scss';

const Link = ({
  children,
  href,
}) => (
  <NextLink
    href={href}
  >
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a
      className={styles.link}
    >
      {children}
    </a>
  </NextLink>
);

Link.propTypes = {
  children: node.isRequired,
  href: string.isRequired,
};

export default Link;
