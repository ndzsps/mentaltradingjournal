import { useState, useEffect } from 'react';

interface ProgressStats {
  preSessionStreak: number;
  postSessionStreak: number;
  dailyStreak: number;
  level: number;
  levelProgress: number;
}

export const useProgressTracking = () => {
  const [stats, setStats] = useState<ProgressStats>({
    preSessionStreak: 0,
    postSessionStreak: 0,
    dailyStreak: 0,
    level: 1,
    levelProgress: 0,
  });

  const updateProgress = (sessionType: 'pre' | 'post') => {
    setStats(prevStats => {
      const newStats = { ...prevStats };

      // Update session-specific streak
      if (sessionType === 'pre') {
        newStats.preSessionStreak += 1;
      } else {
        newStats.postSessionStreak += 1;
      }

      // Update daily streak if both pre and post sessions are completed
      if (newStats.preSessionStreak > 0 && newStats.postSessionStreak > 0) {
        newStats.dailyStreak += 1;
        
        // Reset session streaks for the next day
        newStats.preSessionStreak = 0;
        newStats.postSessionStreak = 0;

        // Update level progress
        newStats.levelProgress += 20;
        if (newStats.levelProgress >= 100) {
          newStats.level += 1;
          newStats.levelProgress = 0;
        }
      }

      return newStats;
    });
  };

  return { stats, updateProgress };
};