import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { auth } from '../../store';

const CallbackPage = ({
  redirect,
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

      router.push(redirect);
    })();
  }, []);

  return null;
};

export const getServerSideProps = async ({ query }) => ({
  props: {
    redirect: query.redirect || auth.signInRoute,
  },
});

export default CallbackPage;
