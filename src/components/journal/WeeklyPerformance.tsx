
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { WeekCard } from "./weekly/WeekCard";
import { LoadingSkeleton } from "./weekly/LoadingSkeleton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useJournalFilters } from "@/hooks/useJournalFilters";

export const WeeklyPerformance = () => {
  const queryClient = useQueryClient();
  const { selectedDate } = useJournalFilters([]);
  const currentDate = selectedDate || new Date();
  const { data: weeklyStats, isLoading } = useWeeklyStats(currentDate);

  // Subscribe to real-time updates for both journal entries and week_stats
  useEffect(() => {
    const channels = [
      supabase
        .channel('journal_entries_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'journal_entries',
          },
          async () => {
            await queryClient.invalidateQueries({ 
              queryKey: ['weekly-performance', currentDate.getMonth() + 1, currentDate.getFullYear()]
            });
          }
        )
        .subscribe(),

      supabase
        .channel('week_stats_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'week_stats',
          },
          async () => {
            await queryClient.invalidateQueries({ 
              queryKey: ['weekly-performance', currentDate.getMonth() + 1, currentDate.getFullYear()]
            });
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient, currentDate]);

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
          tradeCount={week.tradeCount}
        />
      ))}
    </div>
  );
};
