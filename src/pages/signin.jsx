import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { string } from 'prop-types';

import { auth } from '../store';
import Link from '../components/Link';
import AuthForm from '../components/AuthForm';
import useUser from '../hooks/useUser';

const SignInPage = ({
  redirect,
}) => {
  const { loadingUser, user } = useUser({ redirect: false });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  if (user) {
    router.push(redirect);
  }

  if (loadingUser || user) {
    return null;
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setErrors({});

    const { error } = await auth.signin(evt.target);

    if (error) {
      setErrors({ [error.field]: error.message });

      return;
    }

    router.push(redirect);
  };

  return (
    <AuthForm
      heading="Sign in"
      onSubmit={handleSubmit}
      errors={errors}
    >
      <p className="text-center">
        {'Don\'t have an account yet? '}
        <Link
          href={`/register?redirect=${redirect}`}
        >
          Register
        </Link>
      </p>
    </AuthForm>
  );
};

export const getServerSideProps = async (ctx) => ({
  props: {
    redirect: auth.getPostLoginRedirect(ctx),
  },
});

SignInPage.propTypes = {
  redirect: string.isRequired,
};

export default SignInPage;
