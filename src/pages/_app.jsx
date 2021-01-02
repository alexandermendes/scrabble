import React from 'react';
import { any, object } from 'prop-types';
import NextHead from 'next/head';

import { auth } from '../store';
import AuthProvider from '../components/AuthProvider';

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
      <AuthProvider
        excludedRoutes={[
          auth.signInRoute,
          auth.callbackRoute,
        ]}
      >
        <Component
          {...pageProps}
        />
      </AuthProvider>
    </main>
  </>
);

App.propTypes = {
  Component: any.isRequired,
  pageProps: object.isRequired,
};

export default App;
