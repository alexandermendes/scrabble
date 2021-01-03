import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { auth } from '../../store';

const CallbackPage = ({
  redirect,
  displayName,
}) => {
  const router = useRouter();

  // The email link redirect needs to be processed in the browser
  useEffect(() => {
    (async () => {
      try {
        await auth.processSignInLink();
      } catch (err) {
        router.push({
          pathname: auth.signInRoute,
          query: { error: auth.encodeError(err) },
        });

        return;
      }

      const currentUser = await auth.getCurrentUser();

      if (displayName) {
        await currentUser.updateProfile({ displayName });
      }

      router.push(redirect);
    })();
  }, []);

  return null;
};

export const getServerSideProps = async ({ query }) => ({
  props: {
    redirect: query[auth.redirectParam] || auth.signInRoute,
    displayName: query[auth.displayNameParam] || null,
  },
});

export default CallbackPage;
