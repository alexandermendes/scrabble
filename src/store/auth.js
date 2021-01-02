import originalUrl from 'original-url';

import { auth } from './clients';

const SIGNIN_ROUTE = '/signin';
const CALLBACK_ROUTE = '/signin/callback';
const EMAIL_LOCAL_STORAGE_KEY = 'emailForSignIn';

export const authentication = {
  signInRoute: SIGNIN_ROUTE,
  callbackRoute: CALLBACK_ROUTE,

  /**
   * Sign in
   */
  signin: async (email, redirectUrl) => {
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true,
    };

    await auth().sendSignInLinkToEmail(email, actionCodeSettings);

    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem(EMAIL_LOCAL_STORAGE_KEY, email);
  },

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
    const { full: currentUrl } = originalUrl(req);
    const callbackUrl = new URL(CALLBACK_ROUTE, currentUrl);

    let { redirect } = query;
    const { referer } = req.headers;

    if (!redirect && referer) {
      redirect = referer;
    }

    if (!redirect) {
      redirect = '/';
    }

    const { pathname } = new URL(redirect, currentUrl);

    if (pathname === currentUrl.pathname) {
      redirect = '/';
    }

    callbackUrl.searchParams.set('redirect', redirect);

    return callbackUrl.href;
  },

  processSignInLink: async () => {
    if (!auth().isSignInWithEmailLink(window.location.href)) {
      return;
    }

    let email = window.localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY);

    if (!email) {
      // eslint-disable-next-line no-alert
      email = window.prompt('Please provide your email for confirmation');
    }

    await auth().signInWithEmailLink(email, window.location.href);

    window.localStorage.removeItem(EMAIL_LOCAL_STORAGE_KEY);
  },

  /**
   * Get the current user, if any.
   */
  getCurrentUser: async () => new Promise((resolve) => {
    auth().onAuthStateChanged((resolvedUser) => {
      resolve(resolvedUser);
    });
  }),

  /**
   * Encode an error message for passing as a query param.
   */
  encodeError: (error) => btoa(error.message),

  /**
   * Decode an error message.
   */
  decodeError: async (error) => `${atob(error)} Please try again.`,
};
