/**
 * Initialise the admin SDK.
 *
 * Settings are read from the FIREBASE_CONFIG env var.
 *
 * If firebase-admin is imported in the browser an error is thrown, hence the
 * conditional require.
 */
export const initAdmin = () => {
  // eslint-disable-next-line global-require
  const admin = typeof window === 'undefined' ? require('firebase-admin') : null;

  if (admin?.apps.length > 0) {
    return;
  }

  admin.initializeApp();
};
