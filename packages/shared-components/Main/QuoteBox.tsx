// Main/QuoteBox.tsx

import {useTheme} from '@sudoku/shared-themes';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type QuoteProps = {
  q: string;
  a: string;
};

const QuoteBoxComponent = ({q, a}: QuoteProps) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.quoteText, {color: theme.text}]} selectable={true}>
        “{q}” —{'\n'}
        <Text style={[styles.authorText, {color: theme.text}]}>{a}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
  },
  authorText: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
  },
});

export const QuoteBox = React.memo(QuoteBoxComponent);
