import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { string } from 'prop-types';

import { register, getPostLoginRedirect, LOGIN_ROUTE } from '../auth';
import Link from '../components/Link';
import AuthForm from '../components/AuthForm';

const RegisterPage = ({
  redirect,
}) => {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setErrors({});

    const { error } = await register(evt.target);

    if (error) {
      setErrors({ [error.field]: error.message });

      return;
    }

    router.push(redirect);
  };

  return (
    <AuthForm
      heading="Register"
      onSubmit={handleSubmit}
      errors={errors}
    >
      <p className="text-center">
        Already have an account?
        {' '}
        <Link
          href={`${LOGIN_ROUTE}?redirect=${redirect}`}
        >
          Sign in
        </Link>
      </p>
    </AuthForm>
  );
};

export const getServerSideProps = async (ctx) => ({
  props: {
    redirect: getPostLoginRedirect(ctx),
  },
});

RegisterPage.propTypes = {
  redirect: string.isRequired,
};

export default RegisterPage;
