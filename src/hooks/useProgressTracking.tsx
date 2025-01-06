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
    console.log('Progress stats updated:', stats);
  }, [stats]);

  const updateProgress = (sessionType: 'pre' | 'post') => {
    setStats(prevStats => {
      const newStats = { ...prevStats };

      // Update session-specific streaks
      if (sessionType === 'pre') {
        newStats.preSessionStreak += 1;
        console.log('Updated pre-session streak:', newStats.preSessionStreak);
      } else {
        newStats.postSessionStreak += 1;
        console.log('Updated post-session streak:', newStats.postSessionStreak);
      }

      // Update level progress for any session completion
      newStats.levelProgress += 10;

      // Level up if progress reaches 100%
      if (newStats.levelProgress >= 100) {
        newStats.level += 1;
        newStats.levelProgress = 0;
      }

      // Only update daily streak when both sessions are completed
      if (newStats.preSessionStreak > 0 && newStats.postSessionStreak > 0) {
        newStats.dailyStreak += 1;
        // Reset only after incrementing daily streak
        newStats.preSessionStreak = 0;
        newStats.postSessionStreak = 0;
      }

      return newStats;
    });
  };

  const resetProgress = () => {
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

  return { stats, updateProgress, resetProgress };
};