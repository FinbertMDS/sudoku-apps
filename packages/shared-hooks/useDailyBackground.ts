// useDailyBackground.ts

import {UnsplashImageData} from '@sudoku/shared-types';
import {getDailyBackgrounds} from '@sudoku/shared-utils';
import {useEffect, useMemo, useState} from 'react';

export const useDailyBackground = (mode: 'light' | 'dark') => {
  const [backgrounds, setBackgrounds] = useState<{
    light: UnsplashImageData | null;
    dark: UnsplashImageData | null;
  }>({light: null, dark: null});

  const loadBackgrounds = async () => {
    const {light, dark} = await getDailyBackgrounds();
    setBackgrounds({light, dark});
  };

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const background = useMemo(() => {
    return mode === 'dark' ? backgrounds.dark : backgrounds.light;
  }, [mode, backgrounds]);

  return {
    background,
    loadBackgrounds,
  };
};
