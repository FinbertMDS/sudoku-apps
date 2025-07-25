// utils/appUtil.ts

import {AppEnv} from '@sudoku/shared-types';
import {nativeApplicationVersion, nativeBuildVersion} from 'expo-application';
import Constants from 'expo-constants';
import {Platform} from 'react-native';
const extra = Constants.expoConfig?.extra ?? Constants.manifest2?.extra ?? {};

export const appConfig = {
  iosAppId: '6748027534',
  androidPackageName: 'com.finbertngo.sudokuclassic',
  developerMail: 'finbertngo@gmail.com',
  version:
    Platform.OS === 'web'
      ? Constants.expoConfig?.version
      : nativeApplicationVersion,
  buildNumber:
    Platform.OS === 'web'
      ? Constants.expoConfig?.runtimeVersion
      : nativeBuildVersion,
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
      web: `https://github.com/FinbertMDS/sudoku-classic`,
    }),
  supportUrl: 'https://buymeacoffee.com/finbertngo',
};

export const env: AppEnv = {
  UNSPLASH_ACCESS_KEY: extra.UNSPLASH_ACCESS_KEY,
  AD_UNIT_REWARDED_I_ANDROID: extra.AD_UNIT_REWARDED_I_ANDROID,
  AD_UNIT_BANNER_ANDROID: extra.AD_UNIT_BANNER_ANDROID,
  AD_UNIT_BANNER_IOS: extra.AD_UNIT_BANNER_IOS,
  AD_UNIT_INTERSTITIAL_ANDROID: extra.AD_UNIT_INTERSTITIAL_ANDROID,
  AD_UNIT_REWARDED_I_IOS: extra.AD_UNIT_REWARDED_I_IOS,
  AD_UNIT_INTERSTITIAL_IOS: extra.AD_UNIT_INTERSTITIAL_IOS,
  AD_UNIT_REWARDED_ANDROID: extra.AD_UNIT_REWARDED_ANDROID,
  AD_UNIT_REWARDED_IOS: extra.AD_UNIT_REWARDED_IOS,
  iosAppId: appConfig.iosAppId,
  androidPackageName: appConfig.androidPackageName,
};
