import getConfig from 'next/config';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { initClient } from './db/init-client';

export const db = () => {
  const { publicRuntimeConfig } = getConfig();

  initClient(publicRuntimeConfig.firebase);

  return firebase.firestore();
};
