// Statistics/TimeFilterDropdown.tsx

import {useTheme} from '@sudoku/shared-themes';
import {TimeFilter} from '@sudoku/shared-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type TimeFilterDropdownProps = {
  selected: TimeFilter;
  onClose: () => void;
  onSelect: (filter: TimeFilter) => void;
};

const TimeFilterDropdownComponent = ({
  selected,
  onSelect,
  onClose,
}: TimeFilterDropdownProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const options: {label: string; value: TimeFilter}[] = [
    {label: t('filter.allTime'), value: 'all'},
    {label: t('filter.today'), value: 'today'},
    {label: t('filter.thisWeek'), value: 'week'},
    {label: t('filter.thisMonth'), value: 'month'},
    {label: t('filter.thisYear'), value: 'year'},
  ];

  return (
    <Modal transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.container, {backgroundColor: theme.background}]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selected === option.value && {
                    backgroundColor: theme.selectedItemBackground,
                  },
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    borderBottomColor:
                      index === options.length - 1
                        ? 'transparent'
                        : theme.itemBorderColor,
                  },
                  index === 0 && styles.firstOption,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}>
                <Text style={[styles.label, {color: theme.text}]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 16,
  },
  firstOption: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export const TimeFilterDropdown = TimeFilterDropdownComponent;
