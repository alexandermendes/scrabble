import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { string } from 'prop-types';

import { auth } from '../../store';
import AuthForm from '../../components/AuthForm';
import useUser from '../../hooks/useUser';

const SignInPage = ({
  redirect,
  error,
}) => {
  const currentUser = useUser();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState();

  if (currentUser) {
    router.push(redirect);

    return null;
  }

  useEffect(() => {
    if (!error) {
      return;
    }

    (async () => {
      setMessage({
        type: 'error',
        text: await auth.decodeError(error),
      });
    })();
  }, [error]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.target);
    const email = formData.get('email');
    const name = formData.get('name');

    setErrors({});

    try {
      await auth.signin(email, name, redirect);
    } catch (err) {
      // All other codes are a problem with invalid configuration,
      // rather than user error
      if (err.code === 'auth/invalid-email') {
        setErrors({ email: 'This does not appear to be a valid email address' });

        return;
      }

      setMessage({
        type: 'error',
        text: err.message,
      });

      throw err;
    }

    setMessage({
      type: 'success',
      text: `A verification link has been sent to ${email}. `
        + 'Please click on this link to complete the sign up process. '
        + 'If the email does not appear soon check your spam folder.',
    });
  };

  return (
    <AuthForm
      heading="Sign in"
      onSubmit={handleSubmit}
      errors={errors}
      message={message}
    />
  );
};

export const getServerSideProps = async (ctx) => ({
  props: {
    redirect: auth.getPostLoginRedirect(ctx),
    error: ctx.query.error || null,
  },
});

SignInPage.defaultProps = {
  error: null,
};

SignInPage.propTypes = {
  redirect: string.isRequired,
  error: string,
};

export default SignInPage;
