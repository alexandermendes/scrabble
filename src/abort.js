/**
 * Throw an error with the given status code.
 *
 * This is intended to be picked up the error page.
 */
export const abort = (statusCode) => {
  const err = new Error(statusCode);

  err.statusCode = statusCode;

  throw err;
};
