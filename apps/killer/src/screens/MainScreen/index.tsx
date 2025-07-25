// src/screens/MainScreen/index.tsx

import {appConfig, env} from '@/utils/appUtil';
import {
  IS_UI_TESTING,
  LEVELS,
  SCREENS,
  SHOW_UNSPLASH_IMAGE_INFO,
  UNSPLASH_UTM,
} from '@/utils/constants';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {checkAndRequestAdsConsent} from '@sudoku/shared-ads-safe';
import {
  Header,
  NewGameMenu,
  QuoteBox,
  UnsplashImageInfo,
  WhatsNew,
} from '@sudoku/shared-components';
import {CORE_EVENTS, InitGameCoreEvent} from '@sudoku/shared-events';
import eventBus from '@sudoku/shared-events/eventBus';
import {
  useAppPause,
  useAppUpdateChecker,
  useDailyBackground,
  useDailyQuote,
  usePlayerProfile,
} from '@sudoku/shared-hooks';
import {
  BoardService,
  PlayerService,
  SettingsService,
} from '@sudoku/shared-services';
import {useTheme} from '@sudoku/shared-themes';
import {Level, RootStackParamList, WhatsNewEntry} from '@sudoku/shared-types';
import {getWhatsNewList, KILLER_APP_ID} from '@sudoku/shared-utils';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

const MainScreen = () => {
  const {mode, theme} = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const {background, loadBackgrounds} = useDailyBackground(mode);
  const {quote, loadQuote} = useDailyQuote();
  const {player, reloadPlayer} = usePlayerProfile();
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const {needUpdate, forceUpdate, storeUrl, checkVersion} =
    useAppUpdateChecker(env);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [whatsNewEntries, setWhatsNewEntries] = useState<WhatsNewEntry[]>([]);

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      reloadPlayer();
      checkSavedGame();
      loadBackgrounds();
      loadQuote();
      checkVersion();
      checkWhatsNew();
      checkAndRequestAdsConsent();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    checkWhatsNew();
  }, []);

  const checkWhatsNew = async () => {
    const lastVersion = await SettingsService.getLastAppVersionKey();
    const entries = getWhatsNewList(KILLER_APP_ID, lastVersion ?? '');
    if (entries.length > 0) {
      setShowWhatsNew(true);
      setWhatsNewEntries(entries);
    }
  };

  const checkSavedGame = async () => {
    const saved = await BoardService.loadSaved();
    setHasSavedGame(!!saved);
  };

  const handleNewGame = async (level: Level) => {
    await BoardService.clear();
    const id = uuid.v4().toString();
    eventBus.emit(CORE_EVENTS.initGame, {level, id} as InitGameCoreEvent);
    navigation.navigate(SCREENS.BOARD, {
      id,
      level,
      type: 'init',
    });
  };

  const handleContinueGame = async () => {
    const savedGame = await BoardService.loadSaved();
    if (savedGame) {
      navigation.navigate(SCREENS.BOARD, {
        id: savedGame.savedId,
        level: savedGame.savedLevel,
        type: 'saved',
      });
    }
  };

  const handleClearStorage = async () => {
    eventBus.emit(CORE_EVENTS.clearStorage);
    BoardService.clear().then(checkSavedGame);
    PlayerService.clear().then(reloadPlayer);
  };
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (needUpdate && !showUpdateAlert) {
      setShowUpdateAlert(true);
      if (forceUpdate) {
        Alert.alert(
          t('updateRequired'),
          t('updateRequiredDescription'),
          [
            {
              text: t('updateNow'),
              onPress: () => {
                Linking.openURL(storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(t('updateAvailable'), t('updateAvailableDescription'), [
          {
            text: t('later'),
            style: 'cancel',
          },
          {
            text: t('update'),
            onPress: () => {
              Linking.openURL(storeUrl);
            },
          },
        ]);
      }
    }
  }, [forceUpdate, needUpdate, storeUrl, t, showUpdateAlert]);

  useAppPause(
    () => {
      setShowUpdateAlert(false);
      setShowWhatsNew(false);
    },
    () => {},
  );

  return (
    <>
      <SafeAreaView
        edges={['top']}
        style={[styles.container, {backgroundColor: theme.background}]}>
        {background && background.url && (
          <ImageBackground
            source={{uri: background.url}}
            style={[StyleSheet.absoluteFillObject, {top: insets.top}]}
            resizeMode="cover"
            blurRadius={2}>
            {SHOW_UNSPLASH_IMAGE_INFO && (
              <UnsplashImageInfo
                unsplashUtm={UNSPLASH_UTM}
                photographerName={background.photographerName ?? ''}
                photographerLink={background.photographerLink ?? ''}
              />
            )}
          </ImageBackground>
        )}
        <Header
          title={t('appName')}
          showBack={false}
          showSettings={true}
          onSettings={() => {
            navigation.navigate(SCREENS.OPTIONS);
          }}
          showTheme={true}
          showSwitchPlayer={true}
          onSwitchPlayer={() => {
            navigation.navigate(SCREENS.PLAYERS);
          }}
        />
        {quote && <QuoteBox q={quote.q} a={quote.a} />}
        <View style={styles.middle}>
          <Text style={[styles.title, {color: theme.text}]}>
            {t('welcomeTitle', {appName: t('appName')})}
          </Text>
          {player && (
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={[styles.title, {color: theme.text}]}>
              {t('welcomeUser', {
                playerName: player.name,
              })}
            </Text>
          )}
        </View>
        <View style={[styles.footer]}>
          {hasSavedGame && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  borderColor: theme.buttonBorder,
                },
              ]}
              onPress={handleContinueGame}>
              <Text style={[styles.buttonText, {color: theme.buttonText}]}>
                {t('continueGame')}
              </Text>
            </TouchableOpacity>
          )}

          <NewGameMenu handleNewGame={handleNewGame} levels={LEVELS} />

          {__DEV__ && !IS_UI_TESTING && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.danger,
                  borderColor: theme.buttonBorder,
                },
              ]}
              onPress={handleClearStorage}>
              <Text style={[styles.buttonText, {color: theme.buttonText}]}>
                {t('clearStorage')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <WhatsNew
        visible={showWhatsNew}
        onClose={() => {
          setShowWhatsNew(false);
        }}
        entries={whatsNewEntries}
        onGotIt={() => {
          setShowWhatsNew(false);
          SettingsService.setLastAppVersionKey(appConfig.version ?? '');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  attributionText: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 48,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  footer: {
    marginBottom: DeviceInfo.isTablet() ? 32 : 96,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default MainScreen;
