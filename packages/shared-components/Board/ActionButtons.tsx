// Board/ActionButtons.tsx

import {MaterialCommunityIcons} from '@sudoku/shared-icons';
import {useTheme} from '@sudoku/shared-themes';
import {ActionButtonProps} from '@sudoku/shared-types';
import {DeviceUtil} from '@sudoku/shared-utils';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type ActionButtonsProps = {
  noteMode: boolean;
  hintCount: number;
  onNote: (mode: boolean) => void;
  onUndo: () => void;
  onErase: () => void;
  onHint: () => void;
  onSolve: () => void;
};

const ActionButtonsComponent = ({
  noteMode,
  hintCount,
  onNote,
  onUndo,
  onErase,
  onHint,
  onSolve,
}: ActionButtonsProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const handleNote = useCallback(
    (mode: boolean) => {
      onNote(mode);
    },
    [onNote],
  );
  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  const handleErase = useCallback(() => {
    onErase();
  }, [onErase]);

  const handleHint = useCallback(() => {
    onHint();
  }, [onHint]);

  const handleSolve = useCallback(() => {
    onSolve();
  }, [onSolve]);

  const buttons = React.useMemo(() => {
    let allButtons: ActionButtonProps[] = [
      {
        id: 'undo',
        label: t('undo'),
        icon: ['undo'],
        onPress: handleUndo,
      },
      {
        id: 'erase',
        label: t('erase'),
        icon: ['eraser'],
        onPress: handleErase,
      },
      {
        id: 'notes',
        label: t('notes'),
        icon: ['note-outline', 'note-edit-outline'],
        iconChangeFlag: noteMode,
        onPress: () => handleNote(!noteMode),
      },
      {
        id: 'hint',
        label: t('hint'),
        icon: ['lightbulb-outline'],
        showBadge: hintCount > 0,
        badgeCount: hintCount,
        onPress: handleHint,
      },
    ];
    if (__DEV__) {
      allButtons.push({
        id: 'solve',
        label: t('solve'),
        icon: ['lightbulb-on-outline'],
        onPress: handleSolve,
      });
    }
    return allButtons;
  }, [
    noteMode,
    hintCount,
    handleNote,
    handleUndo,
    handleErase,
    handleHint,
    handleSolve,
  ]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {buttons.map((btn, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.actionButton}
          onPress={btn.onPress}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={
                btn.icon.length > 0 && btn.iconChangeFlag
                  ? btn.icon[1]
                  : btn.icon[0]
              }
              size={24}
              color={
                btn.icon.length > 0 && btn.iconChangeFlag
                  ? theme.buttonBlue
                  : theme.secondary
              }
            />
            {btn.showBadge && (
              <View style={[styles.hintBadge, {backgroundColor: theme.danger}]}>
                <Text style={[styles.hintBadgeText, {color: theme.onError}]}>
                  {btn.badgeCount}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.label,
                {
                  color:
                    btn.icon.length > 0 && btn.iconChangeFlag
                      ? theme.buttonBlue
                      : theme.secondary,
                },
              ]}>
              {btn.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginBottom: DeviceUtil.isTablet() ? 0 : 20,
  },
  actionButton: {
    alignItems: 'center' as const,
    marginHorizontal: 10,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 4,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export const ActionButtons = React.memo(ActionButtonsComponent);
