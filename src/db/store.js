import getConfig from 'next/config';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { initClient } from './init-client';

/**
 * Get the database client.
 */
export default () => {
  // TODO: Check if FIRESTORE_CONFIG will work here too
  const { publicRuntimeConfig } = getConfig();

  initClient(publicRuntimeConfig.firebase);

  return firebase.firestore();
};
