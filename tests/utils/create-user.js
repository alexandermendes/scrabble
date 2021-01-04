import { paramCase } from 'param-case';

/**
 * Get basic user data for testing.
 */
export const createUser = (name) => ({
  uid: paramCase(`${name}-uid`),
  displayName: name,
  email: `${paramCase(name)}@example.com`,
});
