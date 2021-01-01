import originalUrl from 'original-url';

import { auth } from './clients';

const EMAIL_KEY = 'email';
const PASSWORD_KEY = 'password';

// Map Firebase error codes to form fields
const errorMap = {
  'auth/invalid-email': EMAIL_KEY,
  'auth/email-already-in-use': EMAIL_KEY,
  'auth/user-not-found': EMAIL_KEY,
  'auth/user-disabled': EMAIL_KEY,
  'auth/wrong-password': PASSWORD_KEY,
  'auth/weak-password': PASSWORD_KEY,
};

/**
 * Sign in or register with an email and password.
 *
 * The form element should have "email" and "password" fields.
 */
const signInOrRegister = async (authFunc, formElement) => {
  const formData = new FormData(formElement);

  const email = formData.get(EMAIL_KEY);
  const password = formData.get(PASSWORD_KEY);

  let user;
  let error;

  try {
    user = await auth()[authFunc](email, password);
  } catch (err) {
    err.field = errorMap[err.code];
    error = err;
  }

  return { user, error };
};

export const authentication = {
  /**
   * Create a user with an email and password.
   */
  register: async (formElement) => (
    signInOrRegister('createUserWithEmailAndPassword', formElement)
  ),

  /**
   * Sign in with an email and password.
   */
  signin: async (formElement) => (
    signInOrRegister('signInWithEmailAndPassword', formElement)
  ),

  /**
   * Sign out.
   */
  logout: async () => auth().signOut(),

  /**
   * Get the path to redirect to after logging in or registering.
   *
   * Uses the `redirect` query param, the referer header, or defaults to the
   * home page.
   */
  getPostLoginRedirect: ({ query, req }) => {
    const currentUrl = originalUrl(req);

    let { redirect } = query;
    const { referer } = req.headers;

    if (!redirect && referer) {
      redirect = referer;
    }

    if (!redirect) {
      return '/';
    }

    const { pathname } = new URL(redirect, currentUrl.full);

    if (pathname === currentUrl.pathname) {
      return '/';
    }

    return pathname;
  },

  /**
   * Get the current user, if any.
   */
  getCurrentUser: async () => new Promise((resolve) => {
    auth().onAuthStateChanged((resolvedUser) => {
      resolve(resolvedUser);
    });
  }),
};
