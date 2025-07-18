// src/screens/SkWebViewScreen/index.tsx

import {useRoute} from '@react-navigation/native';
import {WebViewBase} from '@sudoku/shared-components';
import {
  SkWebViewParamProps,
  SkWebViewScreenRouteProp,
} from '@sudoku/shared-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';

export default function SkWebViewScreen() {
  const {t} = useTranslation();

  const route = useRoute<SkWebViewScreenRouteProp>();
  const {title, type, needPadding} = route.params as SkWebViewParamProps;

  const licensesSource =
    Platform.OS === 'android'
      ? {uri: 'file:///android_asset/licenses.html'}
      : require('@/../assets/htmls/licenses.html');

  const privacyPolicySource =
    Platform.OS === 'android'
      ? {uri: 'file:///android_asset/privacypolicy.html'}
      : require('@/../assets/htmls/privacypolicy.html');

  const termsSource =
    Platform.OS === 'android'
      ? {uri: 'file:///android_asset/terms.html'}
      : require('@/../assets/htmls/terms.html');

  const getSource = () => {
    switch (type) {
      case 'licenses':
        return licensesSource;
      case 'privacy':
        return privacyPolicySource;
      case 'terms':
        return termsSource;
    }
  };

  return (
    <WebViewBase
      title={t(title)}
      source={getSource()}
      needPadding={needPadding}
    />
  );
}
