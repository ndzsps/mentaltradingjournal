import { supabase } from "@/integrations/supabase/client";
import { ProgressStats, SessionType } from "@/types/progressStats";
import { toast } from "sonner";

export const fetchProgressStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('progress_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching progress stats:', error);
    toast.error('Failed to load progress stats');
    throw error;
  }

  return data;
};

export const resetUserStreaks = async (userId: string) => {
  const { error } = await supabase
    .from('progress_stats')
    .update({
      pre_session_streak: 0,
      post_session_streak: 0,
      daily_streak: 0,
      last_activity: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error resetting streaks:', error);
    toast.error('Failed to reset streaks');
    throw error;
  }
};

export const updateProgressStats = async (
  userId: string,
  sessionType: SessionType,
  currentStats: any
) => {
  const updates: any = {
    last_activity: new Date().toISOString(),
  };

  if (sessionType === 'pre') {
    updates.pre_session_streak = 1;
  } else {
    updates.post_session_streak = 1;
  }

  const hasPreSession = sessionType === 'pre' || currentStats.pre_session_streak === 1;
  const hasPostSession = sessionType === 'post' || currentStats.post_session_streak === 1;

  if (hasPreSession && hasPostSession) {
    updates.daily_streak = currentStats.daily_streak + 1;
    updates.pre_session_streak = 0;
    updates.post_session_streak = 0;
    updates.level_progress = Math.min(currentStats.level_progress + 10, 100);
  }

  if (updates.level_progress >= 100) {
    updates.level = currentStats.level + 1;
    updates.level_progress = 0;
  }

  const { error } = await supabase
    .from('progress_stats')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating progress:', error);
    toast.error('Failed to update progress');
    throw error;
  }

  return updates;
};