import { useContext } from 'react';

import TileSizeContext from '../context/TileSizeContext';

/**
 * Get the tile size details.
 */
const useTileSize = () => useContext(TileSizeContext);

export default useTileSize;
