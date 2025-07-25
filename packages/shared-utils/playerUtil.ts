// playerUtil.ts

import {LanguageCode, PlayerProfile} from '@sudoku/shared-types';
import {DEFAULT_PLAYER_ID, getRandomColorKey} from '@sudoku/shared-utils';
import uuid from 'react-native-uuid';

const generatePlayerId = () => {
  let id = uuid.v4().toString();
  while (id === DEFAULT_PLAYER_ID) {
    id = uuid.v4().toString();
  }
  return id;
};

export const createNewPlayer = (name: string): PlayerProfile => ({
  id: generatePlayerId(),
  name,
  avatarColor: getRandomColorKey(),
  createdAt: new Date().toISOString(),
  totalGames: 0,
});

export const createDefaultPlayer = (
  totalGames: number,
  language: LanguageCode,
): PlayerProfile => {
  let defaultPlayerName: string;
  switch (language) {
    case 'ja':
      defaultPlayerName = 'プレイヤー';
      break;
    case 'vi':
      defaultPlayerName = 'Người chơi';
      break;
    default:
      defaultPlayerName = 'Player';
  }

  return {
    id: DEFAULT_PLAYER_ID,
    name: defaultPlayerName,
    avatarColor: getRandomColorKey(),
    createdAt: new Date().toISOString(),
    totalGames,
  };
};
