import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { auth } from '../store';

/**
 * Get the current user, if any.
 */
const useUser = ({
  redirect = true,
} = {}) => {
  const [user, setUser] = useState();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const load = async () => {
      const currentUser = await auth.getCurrentUser();

      if (!currentUser && redirect) {
        router.push({ pathname: '/signin' });

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
