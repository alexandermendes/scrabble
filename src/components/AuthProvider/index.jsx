import React, { useEffect, useState } from 'react';
import { node, arrayOf, string } from 'prop-types';
import { useRouter } from 'next/router';

import { auth } from '../../store';
import UserContext from '../../context/UserContext';

const AuthProvider = ({
  children,
  excludedRoutes,
}) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const currentUser = await auth.getCurrentUser();

      if (!currentUser && !excludedRoutes.includes(router.pathname)) {
        router.push({ pathname: auth.signInRoute });

        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    load();
  }, [excludedRoutes]);

  if (loading) {
    return null; // TODO: Loading spinner?
  }

  return (
    <div
      data-testid="protected-content"
    >
      <UserContext.Provider
        value={user}
      >
        {children}
      </UserContext.Provider>
    </div>
  );
};

AuthProvider.defaultProps = {
  excludedRoutes: [],
};

AuthProvider.propTypes = {
  children: node.isRequired,
  excludedRoutes: arrayOf(string),
};

export default AuthProvider;
