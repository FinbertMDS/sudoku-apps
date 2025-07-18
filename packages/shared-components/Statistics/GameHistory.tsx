// Statistics/GameHistory.tsx

import {EmptyContainer} from '@sudoku/shared-components/commons/EmptyContainer';
import {GameLogCard} from '@sudoku/shared-components/GameHistory/GameLogCard';
import {useTheme} from '@sudoku/shared-themes';
import {GameLogEntryV2, TimeFilter} from '@sudoku/shared-types';
import {getGameHistory} from '@sudoku/shared-utils';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

type GameHistoryProps = {
  logs: GameLogEntryV2[];
  filter: TimeFilter;
};

const GameHistoryComponent = ({logs, filter}: GameHistoryProps) => {
  const {theme} = useTheme();

  const sortedLogs = useMemo(
    () => getGameHistory(logs, filter),
    [logs, filter],
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {sortedLogs.length === 0 ? (
        <EmptyContainer />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{backgroundColor: theme.background}}>
          {sortedLogs.map((log) => (
            <GameLogCard key={log.id} log={log} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});

export const GameHistory = GameHistoryComponent;
