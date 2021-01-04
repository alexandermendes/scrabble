/**
 * Get basic game data for testing.
 */
export const createGame = (user, data = {}) => ({
  owner: user.uid,
  players: [{
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
  }],
  tiles: [],
  turns: [],
  ...data,
});
