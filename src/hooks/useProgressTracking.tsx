import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { differenceInDays } from 'date-fns';

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
        // Check if user has missed a day
        const lastActivity = new Date(data.last_activity);
        const daysSinceLastActivity = differenceInDays(new Date(), lastActivity);

        if (daysSinceLastActivity > 1) {
          // Reset streaks if user missed a day
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
    };

    fetchStats();
  }, [user]);

  const resetStreaks = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('progress_stats')
        .update({
          pre_session_streak: 0,
          post_session_streak: 0,
          daily_streak: 0,
          last_activity: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStats(prev => ({
        ...prev,
        preSessionStreak: 0,
        postSessionStreak: 0,
        dailyStreak: 0,
      }));

      console.log('Streaks reset due to inactivity');
    } catch (error) {
      console.error('Error resetting streaks:', error);
      toast.error('Failed to reset streaks');
    }
  };

  const updateProgress = async (sessionType: 'pre' | 'post') => {
    if (!user) return;

    console.log(`[Progress Tracking] Updating progress for ${sessionType} session`);
    
    try {
      const { data: currentStats } = await supabase
        .from('progress_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentStats) {
        console.error('No progress stats found for user');
        return;
      }

      // Always update last_activity
      const updates: any = {
        last_activity: new Date().toISOString(),
      };

      // Update session-specific streak
      if (sessionType === 'pre') {
        updates.pre_session_streak = 1;
      } else {
        updates.post_session_streak = 1;
      }

      // Check if both sessions are completed for the day
      const hasPreSession = sessionType === 'pre' || currentStats.pre_session_streak > 0;
      const hasPostSession = sessionType === 'post' || currentStats.post_session_streak > 0;

      if (hasPreSession && hasPostSession) {
        // Increment daily streak by 1 when both sessions are completed
        updates.daily_streak = currentStats.daily_streak + 1;
        // Reset session streaks after completing both
        updates.pre_session_streak = 0;
        updates.post_session_streak = 0;
        // Update level progress
        updates.level_progress = Math.min(currentStats.level_progress + 10, 100);
      }

      // Level up if progress reaches 100%
      if (updates.level_progress >= 100) {
        updates.level = currentStats.level + 1;
        updates.level_progress = 0;
      }

      const { error } = await supabase
        .from('progress_stats')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('[Progress Tracking] Progress updated successfully:', updates);

      setStats(prev => ({
        ...prev,
        preSessionStreak: updates.pre_session_streak ?? prev.preSessionStreak,
        postSessionStreak: updates.post_session_streak ?? prev.postSessionStreak,
        dailyStreak: updates.daily_streak ?? prev.dailyStreak,
        level: updates.level ?? prev.level,
        levelProgress: updates.level_progress ?? prev.levelProgress,
      }));

    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  return { stats, updateProgress, resetStreaks };
};