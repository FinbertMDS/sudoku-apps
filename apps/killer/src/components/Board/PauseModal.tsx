import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {AppSettings, Level} from '../../types';
import {MAX_MISTAKES} from '../../utils/constants';
import {formatTime} from '../../utils/dateUtil';

type PauseModalProps = {
  level: Level;
  mistake: number;
  time: number;
  settings: AppSettings;
  onResume: () => void;
};

const PauseModal = ({
  level,
  mistake,
  time,
  settings,
  onResume,
}: PauseModalProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Modal tạm dừng */}
      <Modal
        isVisible={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}
        useNativeDriver
        onBackButtonPress={() => onResume()}
        onBackdropPress={() => onResume()}
        onDismiss={() => onResume()}>
        <View style={[styles.modalBox, {backgroundColor: theme.background}]}>
          {/* Header */}
          <Text style={[styles.modalHeader, {color: theme.text}]}>
            {t('paused')}
          </Text>

          {/* Thông tin Board */}
          <View style={styles.modalBoardInfo}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>{t('level')}</Text>
              <Text style={[styles.infoValue, {color: theme.text}]}>
                {t(`level.${level}`)}
              </Text>
            </View>
            {settings.mistakeLimit && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('mistakes')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {mistake}/{MAX_MISTAKES}
                </Text>
              </View>
            )}
            {settings.timer && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('time')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {formatTime(time)}
                </Text>
              </View>
            )}
          </View>

          {/* Button Tiếp tục */}
          <TouchableOpacity
            style={[styles.resumeButton, {backgroundColor: theme.primary}]}
            onPress={onResume}>
            <Text style={[styles.resumeButtonText, {color: theme.buttonText}]}>
              {t('continue')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    padding: DeviceInfo.isTablet() ? 40 : 20,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: DeviceInfo.isTablet() ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalBoardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: DeviceInfo.isTablet() ? 22 : 14,
    color: '#888',
  },
  infoValue: {
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
    fontWeight: 'bold',
  },
  resumeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  resumeButtonText: {
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
    fontWeight: 'bold',
  },
});

export default React.memo(PauseModal);
