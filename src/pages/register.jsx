import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { string } from 'prop-types';

import { auth } from '../store';
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

    const { error } = await auth.register(evt.target);

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
          href={`/login?redirect=${redirect}`}
        >
          Sign in
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

RegisterPage.propTypes = {
  redirect: string.isRequired,
};

export default RegisterPage;
