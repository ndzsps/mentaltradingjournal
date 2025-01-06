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

      // Update session-specific streaks
      if (sessionType === 'pre') {
        newStats.preSessionStreak += 1;
        console.log('[Progress Tracking] Incremented pre-session streak:', newStats.preSessionStreak);
      } else {
        newStats.postSessionStreak += 1;
        console.log('[Progress Tracking] Incremented post-session streak:', newStats.postSessionStreak);
      }

      // Update level progress for any session completion
      newStats.levelProgress += 10;
      
      // Level up if progress reaches 100%
      if (newStats.levelProgress >= 100) {
        newStats.level += 1;
        newStats.levelProgress = 0;
        console.log('[Progress Tracking] Level up! New level:', newStats.level);
      }

      // Check if both sessions are completed in the same day
      const hasCompletedBothSessions = 
        (sessionType === 'pre' && prevStats.postSessionStreak > 0) ||
        (sessionType === 'post' && prevStats.preSessionStreak > 0);

      if (hasCompletedBothSessions) {
        newStats.dailyStreak += 1;
        console.log('[Progress Tracking] Daily streak increased:', newStats.dailyStreak);
        
        // Only reset streaks after completing both sessions
        newStats.preSessionStreak = 0;
        newStats.postSessionStreak = 0;
        console.log('[Progress Tracking] Reset session streaks after completing both');
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

  return { stats, updateProgress, resetProgress };
};