// i18n.ts

import {LANGUAGES} from '@/utils/constants';
import {appStorage} from '@sudoku/shared-storages';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import ja from './locales/ja.json';
import vi from './locales/vi.json';

const resources = {
  en: {translation: en},
  vi: {translation: vi},
  ja: {translation: ja},
};

const fallback = {languageTag: LANGUAGES[0].code};
const getBestLanguage = () => {
  const bestLang = RNLocalize.findBestLanguageTag(LANGUAGES.map((l) => l.code));
  return bestLang?.languageTag || fallback.languageTag;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getBestLanguage(),
  fallbackLng: fallback.languageTag,
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Auto-detects the system language and updates the i18n language if it differs from the stored language.
 * Also updates the stored language in AsyncStorage.
 */
export const autoDetectLanguage = async () => {
  try {
    const systemLang = getBestLanguage();
    const oldLanguage = appStorage.getLangKeyDefault();

    if (systemLang !== oldLanguage) {
      i18n.changeLanguage(systemLang);
      appStorage.saveLangKeyDefault(systemLang);
      appStorage.saveLangKeyPreferred(systemLang);
      return systemLang;
    }

    const preferedLanguage = appStorage.getLangKeyPreferred();
    if (preferedLanguage) {
      i18n.changeLanguage(preferedLanguage);
    }

    return preferedLanguage;
  } catch (_) {}
};

export const getLanguage = () => {
  try {
    const systemLang = getBestLanguage();
    const oldLanguage = appStorage.getLangKeyDefault();

    if (systemLang !== oldLanguage) {
      return systemLang;
    }

    const preferedLanguage = appStorage.getLangKeyPreferred();
    return preferedLanguage || systemLang || fallback.languageTag;
  } catch (_) {}
};

export default i18n;
