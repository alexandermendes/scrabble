const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const stylesDir = path.join(__dirname, 'src', 'styles');
const privateKeyPath = path.join(__dirname, 'private-key.json');

if (!fs.existsSync(privateKeyPath)) {
  throw new Error(`A Firebase private key JSON file must be added at ${privateKeyPath}`);
}

module.exports = {
  sassOptions: {
    includePaths: [stylesDir],
    prependData: [
      `@import "${stylesDir}/_settings.scss";`,
      `@import "${stylesDir}/_tools.scss";`,
    ].join('\n'),
  },

  publicRuntimeConfig: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    },
  },

  env: {
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG || fs.readFileSync(privateKeyPath).toString(),
  },

  webpack: (config) => ({
    ...config,
    node: {
      ...config.node,
      net: 'empty', // Required for the original-url package
    },
  }),
};
