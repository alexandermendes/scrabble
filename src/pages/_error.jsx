import React from 'react';
import Error from 'next/error';
import { number } from 'prop-types';

/**
 * Custom error page.
 *
 * This is primaily here so that we can throw an error from any page, assign
 * a status code to that error, and have Next.js render the error page with
 * the correct status code.
 */
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
