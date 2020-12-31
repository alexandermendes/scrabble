import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import firebase from 'firebase/app';
import 'firebase/auth';
import { initClient } from '../db/init-client';

/**
 * Get the current user, if any.
 */
const useUser = () => {
  const [user, setUser] = useState();
  const [loadingUser, setLoadingUser] = useState(true);
  const { publicRuntimeConfig } = getConfig();

  initClient(publicRuntimeConfig.firebase);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((resolvedUser) => {
      setUser(resolvedUser);
      setLoadingUser(false);
    });
  }, []);

  return { loadingUser, user };
};

export default useUser;
