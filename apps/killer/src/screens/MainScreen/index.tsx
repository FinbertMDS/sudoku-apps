// src/screens/MainScreen/index.tsx
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import Header from '../../components/commons/Header';
import NewGameMenu from '../../components/Main/NewGameMenu';
import QuoteBox from '../../components/Main/QuoteBox';
import {useTheme} from '../../context/ThemeContext';
import {CORE_EVENTS} from '../../events';
import eventBus from '../../events/eventBus';
import {InitGameCoreEvent} from '../../events/types';
import {useAppPause} from '../../hooks/useAppPause';
import {useAppUpdateChecker} from '../../hooks/useAppUpdateChecker';
import {useDailyBackground} from '../../hooks/useDailyBackground';
import {useDailyQuote} from '../../hooks/useDailyQuote';
import {usePlayerProfile} from '../../hooks/usePlayerProfile';
import {BoardService} from '../../services/BoardService';
import {PlayerService} from '../../services/PlayerService';
import {Level, RootStackParamList} from '../../types/index';
import {
  IS_UI_TESTING,
  SCREENS,
  SHOW_UNSPLASH_IMAGE_INFO,
  UNSPLASH_URL,
  UNSPLASH_UTM,
} from '../../utils/constants';

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
    useAppUpdateChecker();

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      reloadPlayer();
      checkSavedGame();
      loadBackgrounds();
      loadQuote();
      checkVersion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
              <View style={styles.attributionContainer}>
                <Text style={[styles.attributionText, {color: theme.text}]}>
                  Photo by{' '}
                  <Text
                    style={[styles.linkText, {color: theme.secondary}]}
                    onPress={() =>
                      Linking.openURL(
                        (background.photographerLink ?? UNSPLASH_URL) +
                          UNSPLASH_UTM,
                      )
                    }>
                    {background.photographerName}
                  </Text>{' '}
                  on{' '}
                  <Text
                    style={[styles.linkText, {color: theme.secondary}]}
                    onPress={() =>
                      Linking.openURL(UNSPLASH_URL + UNSPLASH_UTM)
                    }>
                    Unsplash
                  </Text>
                </Text>
              </View>
            )}
          </ImageBackground>
        )}
        <Header
          title={t('appName')}
          showBack={false}
          showSettings={true}
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

          <NewGameMenu handleNewGame={handleNewGame} />

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
