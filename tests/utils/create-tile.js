import { v4 as uuid } from 'uuid';

/**
 * Get basic tile data for testing.
 */
export const createTile = (letter, data) => ({
  id: uuid(),
  letter,
  score: 1,
  type: 'tile',
  cellId: null,
  userId: null,
  used: false,
  pendingExchange: false,
  ...data,
});
