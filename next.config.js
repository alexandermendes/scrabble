const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const stylesDir = path.join(__dirname, 'src', 'styles');
const privateKeyPath = path.join(__dirname, 'private-key.json');
const firebaseWebConfigPath = path.join(__dirname, 'firebase-web-config.json');

if (!fs.existsSync(privateKeyPath) && !process.env.FIREBASE_CONFIG) {
  throw new Error(`A Firebase private key JSON file must be added at ${privateKeyPath} or via FIREBASE_CONFIG`);
}

if (!fs.existsSync(firebaseWebConfigPath) && !process.env.FIREBASE_WEB_CONFIG) {
  throw new Error(`A Firebase private key JSON file must be added at ${firebaseWebConfigPath} or via FIREBASE_CONFIG`);
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
    firebase: process.env.FIREBASE_WEB_CONFIG || require(firebaseWebConfigPath),
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
