
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
  const { data: weeklyStats, isLoading } = useWeeklyStats(selectedDate || new Date());

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
        async () => {
          // Immediately refetch the data when changes occur
          await queryClient.invalidateQueries({ queryKey: ['weekly-performance'] });
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
          tradeCount={week.tradeCount}
        />
      ))}
    </div>
  );
};
