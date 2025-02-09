
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntryType } from "@/types/journal";
import { 
  startOfMonth, 
  endOfMonth,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  isSameWeek,
  getYear,
  getMonth,
  format
} from "date-fns";

interface WeekSummary {
  weekNumber: number;
  totalPnL: number;
  tradingDays: number;
  tradeCount: number;
}

export const useWeeklyStats = (selectedDate: Date) => {
  const { user } = useAuth();
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const year = getYear(selectedDate);
  const month = getMonth(selectedDate) + 1; // getMonth is 0-based

  return useQuery({
    queryKey: ['weekly-performance', month, year],
    queryFn: async () => {
      if (!user) return [];

      // Get existing stats from week_stats table
      const { data: weekStats, error: weekStatsError } = await supabase
        .from('week_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .order('week_number', { ascending: true });

      if (weekStatsError) {
        console.error('Error fetching week stats:', weekStatsError);
        throw weekStatsError;
      }

      // If we have stats for this month, return them
      if (weekStats && weekStats.length > 0) {
        console.log('Found existing week stats:', weekStats);
        return weekStats.map(stat => ({
          weekNumber: stat.week_number,
          totalPnL: Number(stat.total_pnl),
          tradingDays: stat.trading_days,
          tradeCount: stat.trade_count
        }));
      }

      // If no stats exist, calculate them from journal entries
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Get all weeks in the month
      const weeksInMonth = eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 1 } // Week starts on Monday
      );

      // Initialize weeks array based on actual weeks in the month
      const weeks: WeekSummary[] = weeksInMonth.map((_, index) => ({
        weekNumber: index + 1,
        totalPnL: 0,
        tradingDays: 0,
        tradeCount: 0,
      }));

      // Track unique dates for trading days count
      const tradingDays: Set<string>[] = weeksInMonth.map(() => new Set());

      // For debugging: store trades by week
      const tradesByWeek: { date: string; pnl: number; entryId: string }[][] = weeksInMonth.map(() => []);

      // Filter and process entries
      (entries as JournalEntryType[])?.forEach(entry => {
        if (!entry.trades || !Array.isArray(entry.trades)) return;
        
        entry.trades.forEach(trade => {
          if (!trade.entryDate) return;
          
          const tradeDate = new Date(trade.entryDate);
          
          // Check if trade falls within the selected month
          if (!isWithinInterval(tradeDate, { start: monthStart, end: monthEnd })) {
            return;
          }

          // Find which week of the month this trade belongs to
          const weekIndex = weeksInMonth.findIndex(weekStart => 
            isSameWeek(tradeDate, weekStart, { weekStartsOn: 1 })
          );

          if (weekIndex !== -1) {
            // Add trading day
            tradingDays[weekIndex].add(tradeDate.toISOString().split('T')[0]);
            
            const pnlValue = trade.pnl || trade.profit_loss || 0;
            const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
            
            if (!isNaN(numericPnL)) {
              weeks[weekIndex].totalPnL += numericPnL;
              weeks[weekIndex].tradeCount++;

              // Store trade details for debugging
              tradesByWeek[weekIndex].push({
                date: format(tradeDate, 'yyyy-MM-dd'),
                pnl: numericPnL,
                entryId: entry.id
              });
            }
          }
        });
      });

      // Set trading days count for each week
      weeks.forEach((week, index) => {
        week.tradingDays = tradingDays[index].size;
      });

      // Log detailed breakdown for week 2
      const week2Trades = tradesByWeek[1]?.sort((a, b) => a.date.localeCompare(b.date));
      console.log('Week 2 Trade Breakdown:', week2Trades);
      
      if (week2Trades) {
        const totalPnL = week2Trades.reduce((sum, trade) => sum + trade.pnl, 0);
        console.log('Week 2 Total PnL (calculated):', totalPnL);
        console.log('Week 2 Total PnL (from weeks array):', weeks[1].totalPnL);
        
        // Group by date for easier verification
        const byDate = week2Trades.reduce((acc, trade) => {
          acc[trade.date] = (acc[trade.date] || 0) + trade.pnl;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('Week 2 PnL by date:', byDate);
      }

      // Store the calculated stats in the week_stats table
      const promises = weeks.map(week => 
        supabase
          .from('week_stats')
          .upsert({
            user_id: user.id,
            year,
            month,
            week_number: week.weekNumber,
            total_pnl: week.totalPnL,
            trading_days: week.tradingDays,
            trade_count: week.tradeCount
          })
          .select()
      );

      await Promise.all(promises);

      return weeks;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
};
