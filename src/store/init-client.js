import getConfig from 'next/config';
import firebase from 'firebase/app';
import 'firebase/firestore';

/**
 * Initialise the firebase SDK.
 */
export const initClient = () => {
  const { publicRuntimeConfig } = getConfig();

  if (firebase.apps.length > 0) {
    return;
  }

  firebase.initializeApp(publicRuntimeConfig.firebase);
};
