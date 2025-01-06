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

  // Ensure stats are saved whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    console.log('Progress stats updated:', stats); // Debug log
  }, [stats]);

  const updateProgress = (sessionType: 'pre' | 'post') => {
    setStats(prevStats => {
      const newStats = { ...prevStats };

      // Update session-specific streaks
      if (sessionType === 'pre') {
        newStats.preSessionStreak += 1;
        console.log('Updated pre-session streak:', newStats.preSessionStreak); // Debug log
      } else {
        newStats.postSessionStreak += 1;
        console.log('Updated post-session streak:', newStats.postSessionStreak); // Debug log
      }

      // Update level progress for any session completion
      newStats.levelProgress += 10;

      // Level up if progress reaches 100%
      if (newStats.levelProgress >= 100) {
        newStats.level += 1;
        newStats.levelProgress = 0;
      }

      // Check if both sessions are completed to update daily streak
      if (newStats.preSessionStreak > 0 && newStats.postSessionStreak > 0) {
        newStats.dailyStreak += 1;
        // Reset session streaks after completing both
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