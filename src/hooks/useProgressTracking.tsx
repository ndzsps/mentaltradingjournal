import { useState, useEffect } from 'react';

interface ProgressStats {
  preSessionStreak: number;
  postSessionStreak: number;
  dailyStreak: number;
  level: number;
  levelProgress: number;
}

const STORAGE_KEY = 'trading-journal-progress';

export const useProgressTracking = () => {
  const [stats, setStats] = useState<ProgressStats>(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) : {
      preSessionStreak: 0,
      postSessionStreak: 0,
      dailyStreak: 0,
      level: 1,
      levelProgress: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    console.log('[Progress Tracking] Current stats:', stats);
  }, [stats]);

  const updateProgress = (sessionType: 'pre' | 'post') => {
    console.log(`[Progress Tracking] Updating progress for ${sessionType} session`);
    console.log('[Progress Tracking] Previous stats:', stats);

    setStats(prevStats => {
      const newStats = { ...prevStats };

      // Simply increment the respective streak without any conditions
      if (sessionType === 'pre') {
        newStats.preSessionStreak += 1;
        console.log('[Progress Tracking] Incremented pre-session streak:', newStats.preSessionStreak);
      } else {
        newStats.postSessionStreak += 1;
        console.log('[Progress Tracking] Incremented post-session streak:', newStats.postSessionStreak);
      }

      // Update level progress
      newStats.levelProgress += 10;
      
      // Level up if progress reaches 100%
      if (newStats.levelProgress >= 100) {
        newStats.level += 1;
        newStats.levelProgress = 0;
        console.log('[Progress Tracking] Level up! New level:', newStats.level);
      }

      // Only update daily streak if both sessions are completed
      if (newStats.preSessionStreak > 0 && newStats.postSessionStreak > 0) {
        newStats.dailyStreak += 1;
        // Reset streaks only after updating daily streak
        newStats.preSessionStreak = 0;
        newStats.postSessionStreak = 0;
        console.log('[Progress Tracking] Daily streak increased:', newStats.dailyStreak);
      }

      console.log('[Progress Tracking] Updated stats:', newStats);
      return newStats;
    });
  };

  const resetProgress = () => {
    console.log('[Progress Tracking] Resetting all progress');
    const initialStats = {
      preSessionStreak: 0,
      postSessionStreak: 0,
      dailyStreak: 0,
      level: 1,
      levelProgress: 0,
    };
    setStats(initialStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats));
  };

  // Reset the stats immediately when the hook is initialized
  useEffect(() => {
    resetProgress();
  }, []);

  return { stats, updateProgress, resetProgress };
};