import React, { useEffect } from 'react';
import { any, object } from 'prop-types';
import getConfig from 'next/config';
import NextHead from 'next/head';

import '../styles/styles.scss';

import { initClient } from '../db/init-client';

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    const { publicRuntimeConfig } = getConfig();

    initClient(publicRuntimeConfig.firebase);
  }, []);

  return (
    <>
      <NextHead>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto|Montserrat&display=swap"
        />
      </NextHead>
      <main>
        <Component
          {...pageProps}
        />
      </main>
    </>
  );
};

App.propTypes = {
  Component: any.isRequired,
  pageProps: object.isRequired,
};

export default App;
