import React from 'react';

import Auth from '../components/Auth';
import Game from '../components/Game';
import { db } from '../db';
import { abort } from '../abort';

const GamePage = () => (
  <Auth>
    <Game />
  </Auth>
);

// export const getServerSideProps = async ({ params }) => {
//   const gameDocRef = db().collection('games').doc(params.id);
//   const doc = await gameDocRef.get();

//   if (!doc.exists) {
//     abort(404);
//   }

//   return {
//     props: {},
//   };
// };

export default GamePage;
