// navigationAdapter.ts

import type {NavigationImpl} from '@sudoku/shared-navigation/types';

let navigationImpl: NavigationImpl | null = null;

export const setNavigationImpl = (impl: NavigationImpl) => {
  navigationImpl = impl;
};

export const getNavigation = () => {
  if (!navigationImpl) throw new Error('Navigation not initialized');
  return navigationImpl;
};
