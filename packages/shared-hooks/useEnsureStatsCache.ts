// useEnsureStatsCache.ts

import {PlayerService, StatsService} from '@sudoku/shared-services';
import {TimeFilter} from '@sudoku/shared-types';
import {useEffect} from 'react';

export function useEnsureStatsCache() {
  const updateStatsCache = async (): Promise<boolean> => {
    try {
      const needsUpdate = await StatsService.shouldUpdateStatsCache();

      if (needsUpdate) {
        const affectedRanges: TimeFilter[] = [
          'today',
          'week',
          'month',
          'year',
          'all',
        ];

        const playerId = await PlayerService.getCurrentPlayerId();
        const allLogsByPlayerId =
          await StatsService.getLogsByPlayerId(playerId);
        await StatsService.updateStatsWithAllCache(
          allLogsByPlayerId,
          affectedRanges,
          playerId,
        );

        await StatsService.updateStatsDone();
      }
      return needsUpdate;
    } catch (err) {
      console.error('Failed to ensure stats cache:', err);
    }
    return false;
  };

  useEffect(() => {
    updateStatsCache();
  }, []);

  return {
    updateStatsCache,
  };
}
