import firebase from 'firebase/app';
import 'firebase/firestore';

export const initClient = (settings) => {
  if (firebase.apps.length > 0) {
    return;
  }

  firebase.initializeApp(settings);
};
