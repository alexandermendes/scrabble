import React from 'react';
import { node } from 'prop-types';
import { useRouter } from 'next/router';

import useUser from '../../hooks/useUser';

const Auth = ({ children }) => {
  const { loadingUser, user } = useUser();
  const router = useRouter();

  if (loadingUser) {
    return null;
  }

  if (!user) {
    router.push({ pathname: '/login' });

    return null;
  }

  return (
    <div
      data-testid="protected-content"
    >
      {children}
    </div>
  );
};

Auth.propTypes = {
  children: node.isRequired,
};

export default Auth;
