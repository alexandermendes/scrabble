import React from 'react';
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { initAdmin } from '../store';

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);

    // TODO: Are we actually using the admin client at all?
    initAdmin();

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
