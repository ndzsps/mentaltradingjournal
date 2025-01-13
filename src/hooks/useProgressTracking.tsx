import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { ProgressStats, SessionType } from "@/types/progressStats";
import { shouldResetStreak } from "@/utils/dateUtils";
import { 
  fetchProgressStats, 
  resetUserStreaks, 
  updateProgressStats 
} from "@/services/progressService";

export const useProgressTracking = () => {
  const [stats, setStats] = useState<ProgressStats>({
    preSessionStreak: 0,
    postSessionStreak: 0,
    dailyStreak: 0,
    level: 1,
    levelProgress: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const initializeStats = async () => {
      if (!user) return;

      try {
        const data = await fetchProgressStats(user.id);
        
        if (data) {
          const lastActivity = new Date(data.last_activity);
          
          if (shouldResetStreak(lastActivity)) {
            await resetStreaks();
            return;
          }

          setStats({
            preSessionStreak: data.pre_session_streak,
            postSessionStreak: data.post_session_streak,
            dailyStreak: data.daily_streak,
            level: data.level,
            levelProgress: data.level_progress,
          });
        }
      } catch (error) {
        console.error('Error initializing stats:', error);
      }
    };

    initializeStats();
  }, [user]);

  const resetStreaks = async () => {
    if (!user) return;

    try {
      await resetUserStreaks(user.id);
      setStats(prev => ({
        ...prev,
        preSessionStreak: 0,
        postSessionStreak: 0,
        dailyStreak: 0,
      }));
      console.log('Streaks reset due to missed weekday activity');
    } catch (error) {
      console.error('Error in resetStreaks:', error);
    }
  };

  const updateProgress = async (sessionType: SessionType) => {
    if (!user) return;

    console.log(`[Progress Tracking] Updating progress for ${sessionType} session`);
    
    try {
      const currentStats = await fetchProgressStats(user.id);
      if (!currentStats) {
        console.error('No progress stats found for user');
        return;
      }

      const updates = await updateProgressStats(user.id, sessionType, currentStats);
      
      setStats(prev => ({
        ...prev,
        preSessionStreak: updates.pre_session_streak ?? prev.preSessionStreak,
        postSessionStreak: updates.post_session_streak ?? prev.postSessionStreak,
        dailyStreak: updates.daily_streak ?? prev.dailyStreak,
        level: updates.level ?? prev.level,
        levelProgress: updates.level_progress ?? prev.levelProgress,
      }));

    } catch (error) {
      console.error('Error in updateProgress:', error);
    }
  };

  return { stats, updateProgress, resetStreaks };
};