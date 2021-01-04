import { db } from './clients';
import { createTiles } from '../game/tiles';

const GAME_COLLECTION = 'games';

export const games = {
  /**
   * Create a game.
   */
  create: async (user) => db().collection(GAME_COLLECTION).add({
    owner: user.uid,
    players: [{
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    }],
    tiles: createTiles(),
    turns: [],
  }),

  /**
   * Load a game.
   */
  get: async (id) => {
    const { docs, empty } = await db()
      .collection(GAME_COLLECTION)
      .limit(1)
      .where('__name__', '==', id)
      .get();

    if (empty) {
      return null;
    }

    return docs[0].data();
  },

  /**
   * Update a game.
   */
  update: async (id, data) => {
    await db()
      .collection(GAME_COLLECTION)
      .doc(id)
      .set(data);
  },

  /**
   * Listen for updates.
   */
  listen: (id, callback) => {
    db()
      .collection(GAME_COLLECTION)
      .doc(id)
      .onSnapshot((doc) => {
        callback(doc.data());
      });
  },
};
