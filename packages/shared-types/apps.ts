// apps.ts

import {AppSettings, Level} from '@sudoku/shared-types';

export interface AppEnv {
  UNSPLASH_ACCESS_KEY: string;
  AD_UNIT_BANNER_IOS: string;
  AD_UNIT_INTERSTITIAL_IOS: string;
  AD_UNIT_REWARDED_IOS: string;
  AD_UNIT_REWARDED_I_IOS: string;
  AD_UNIT_BANNER_ANDROID: string;
  AD_UNIT_INTERSTITIAL_ANDROID: string;
  AD_UNIT_REWARDED_ANDROID: string;
  AD_UNIT_REWARDED_I_ANDROID: string;
  iosAppId: string;
  androidPackageName: string;
}

export interface ConstantEnv {
  MAX_MISTAKES: number;
  MAX_HINTS: number;
  MAX_TIME_PLAYED: number;
  DEFAULT_SETTINGS: AppSettings;
  LEVELS: Level[];
}

export type TranslatedText = {
  en: string;
  vi?: string;
  ja?: string;
};

export type WhatsNewChange = {
  title: TranslatedText;
  description: TranslatedText;
};

export type WhatsNewEntry = {
  version: string;
  changes: WhatsNewChange[];
};

export type LanguageCode = 'en' | 'vi' | 'ja';

export type Language = {
  code: LanguageCode;
  label: string;
};

export type AppId = 'classic' | 'killer';
