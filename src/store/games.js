import { db } from './clients';
import { createTiles } from '../data/tiles';

const GAME_COLLECTION = 'games';

export const games = {
  /**
   * Create a game.
   */
  create: async (user) => db().collection(GAME_COLLECTION).add({
    author: user.uid,
    players: [user.uid],
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
};
