import { useContext } from 'react';

import UserContext from '../context/UserContext';

/**
 * Get the current user.
 */
const useUser = () => useContext(UserContext);

export default useUser;
