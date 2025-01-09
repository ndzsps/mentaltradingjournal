import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { WeekCard } from "./weekly/WeekCard";
import { LoadingSkeleton } from "./weekly/LoadingSkeleton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const WeeklyPerformance = () => {
  const queryClient = useQueryClient();
  const { data: weeklyStats, isLoading } = useWeeklyStats();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        () => {
          // Invalidate and refetch weekly stats when journal entries change
          queryClient.invalidateQueries({ queryKey: ['weekly-performance'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] pt-[150px]">
      {weeklyStats?.map((week) => (
        <WeekCard
          key={week.weekNumber}
          weekNumber={week.weekNumber}
          totalPnL={week.totalPnL}
        />
      ))}
    </div>
  );
};