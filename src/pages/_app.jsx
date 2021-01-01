import React from 'react';
import { any, object } from 'prop-types';
import NextHead from 'next/head';

import '../styles/styles.scss';

const App = ({ Component, pageProps }) => (
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

App.propTypes = {
  Component: any.isRequired,
  pageProps: object.isRequired,
};

export default App;
