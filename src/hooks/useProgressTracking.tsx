import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('progress_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching progress stats:', error);
        toast.error('Failed to load progress stats');
        return;
      }

      if (data) {
        setStats({
          preSessionStreak: data.pre_session_streak,
          postSessionStreak: data.post_session_streak,
          dailyStreak: data.daily_streak,
          level: data.level,
          levelProgress: data.level_progress,
        });
      }
    };

    fetchStats();
  }, [user]);

  const updateProgress = async (sessionType: 'pre' | 'post') => {
    if (!user) return;

    console.log(`[Progress Tracking] Updating progress for ${sessionType} session`);
    console.log('[Progress Tracking] Previous stats:', stats);

    const newStats = { ...stats };

    // Update streaks based on session type
    if (sessionType === 'pre') {
      newStats.preSessionStreak += 1;
      newStats.levelProgress += 10;
    } else {
      newStats.postSessionStreak += 1;
      newStats.levelProgress += 10;
    }

    // Level up if progress reaches 100%
    if (newStats.levelProgress >= 100) {
      newStats.level += 1;
      newStats.levelProgress = 0;
    }

    // Check if both sessions are completed for the day
    const bothSessionsCompleted = 
      (sessionType === 'pre' && newStats.postSessionStreak > 0) || 
      (sessionType === 'post' && newStats.preSessionStreak > 0);

    // Update daily streak if both sessions are completed
    if (bothSessionsCompleted) {
      newStats.dailyStreak += 1;
      // We'll reset the session streaks at the start of the next day
      // This allows users to see their current progress
    }

    try {
      const { error } = await supabase
        .from('progress_stats')
        .update({
          pre_session_streak: newStats.preSessionStreak,
          post_session_streak: newStats.postSessionStreak,
          daily_streak: newStats.dailyStreak,
          level: newStats.level,
          level_progress: newStats.levelProgress,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating progress stats:', error);
        toast.error('Failed to update progress');
        return;
      }

      console.log('[Progress Tracking] Updated stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const resetProgress = async () => {
    if (!user) return;

    console.log('[Progress Tracking] Resetting all progress');
    const initialStats = {
      preSessionStreak: 0,
      postSessionStreak: 0,
      dailyStreak: 0,
      level: 1,
      levelProgress: 0,
    };

    const { error } = await supabase
      .from('progress_stats')
      .update({
        pre_session_streak: 0,
        post_session_streak: 0,
        daily_streak: 0,
        level: 1,
        level_progress: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error resetting progress:', error);
      toast.error('Failed to reset progress');
      return;
    }

    setStats(initialStats);
  };

  return { stats, updateProgress, resetProgress };
};