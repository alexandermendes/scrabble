import firebase from 'firebase/app';
import 'firebase/auth';
import originalUrl from 'original-url';

export const LOGIN_ROUTE = '/signin';
export const REGISTER_ROUTE = '/register';

const EMAIL_KEY = 'email';
const PASSWORD_KEY = 'password';

// Map Firebase error codes to form fields
const errorMap = {
  'auth/invalid-email': EMAIL_KEY,
  'auth/email-already-in-use': EMAIL_KEY,
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
    user = await firebase.auth()[authFunc](email, password);
  } catch (err) {
    err.field = errorMap[err.code];
    error = err;
  }

  return { user, error };
};

/**
 * Create a user with an email and password.
 */
export const register = async (formElement) => (
  signInOrRegister('createUserWithEmailAndPassword', formElement)
);

/**
 * Sign in with an email and password.
 */
export const signin = async (formElement) => (
  signInOrRegister('signInWithEmailAndPassword', formElement)
);

/**
 * Sign out.
 */
export const logout = async () => firebase.auth().signOut();

/**
 * Get the path to redirect to after logging in or registering.
 */
export const getPostLoginRedirect = ({ query, req }) => {
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
};

/**
 * Get the current user, if any.
 */
export const getCurrentUser = async () => new Promise((resolve) => {
  firebase.auth().onAuthStateChanged((resolvedUser) => {
    resolve(resolvedUser);
  });
});
