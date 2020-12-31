import * as admin from 'firebase-admin';

/**
 * Initialise the admin SDK.
 *
 * Settings are read from the FIREBASE_CONFIG env var.
 */
export const initAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }

  admin.initializeApp();
};
