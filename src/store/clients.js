import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { initClient } from './init-client';

/**
 * Get the database client.
 */
export const db = () => {
  initClient();

  return firebase.firestore();
};

/**
 * Get the auth client.
 */
export const auth = () => {
  initClient();

  return firebase.auth();
};
