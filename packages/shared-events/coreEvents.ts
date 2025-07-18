// coreEvents.ts

export const CORE_EVENTS = {
  initGame: 'initGame',
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  statisticsUpdated: 'statisticsUpdated',
  settingsUpdated: 'settingsUpdated',
  clearStorage: 'clearStorage',
  defaultPlayerUpdated: 'defaultPlayerUpdated',
  defaultPlayerUpdated_Done: 'defaultPlayerUpdated_Done',
  createPlayer: 'createPlayer',
  updatePlayerName: 'updatePlayerName',
  switchPlayer: 'switchPlayer',
} as const;

export type CoreEventName = keyof typeof CORE_EVENTS;
export type CoreEventValue = (typeof CORE_EVENTS)[CoreEventName];
