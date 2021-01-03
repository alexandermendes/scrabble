import { useRouter } from 'next/router';

import useUser from './useUser';
import { games } from '../store';

const useNewGame = () => {
  const router = useRouter();
  const currentUser = useUser();

  const createNewGame = async () => {
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    const docRef = await games.create(currentUser);

    router.push({
      pathname: '/[id]',
      query: { id: docRef.id },
    });
  };

  return createNewGame;
};

export default useNewGame;
