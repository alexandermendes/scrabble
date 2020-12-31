import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { initClient } from '../db/init-client';
import { getCurrentUser, LOGIN_ROUTE } from '../auth';

/**
 * Get the current user, if any.
 */
const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const { publicRuntimeConfig } = getConfig();

  initClient(publicRuntimeConfig.firebase);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.push({ pathname: LOGIN_ROUTE });

        return;
      }

      setUser(currentUser);
      setLoadingUser(false);
    };

    load();
  }, []);

  return { loadingUser, user };
};

export default useUser;
