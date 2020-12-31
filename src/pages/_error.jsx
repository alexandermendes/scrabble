import React from 'react';
import Error from 'next/error';
import { number } from 'prop-types';

const ErrorPage = ({
  statusCode,
  ...restProps
}) => (
  <Error
    statusCode={statusCode}
    {...restProps}
  />
);

ErrorPage.getInitialProps = async ({ res, err }) => {
  const validStatusCodes = /^[1-9][0-9][0-9]$/;
  let statusCode = 404;

  if (err) {
    statusCode = err?.statusCode?.toString().match(validStatusCodes) ? err.statusCode : 500;
  } else if (res?.statusCode) {
    ({ statusCode } = res);
  }

  if (res) {
    res.statusCode = statusCode;
  }

  return { statusCode };
};

ErrorPage.propTypes = {
  statusCode: number.isRequired,
};

export default ErrorPage;
