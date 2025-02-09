
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntryType } from "@/types/journal";
import { 
  startOfMonth, 
  endOfMonth,
  isWithinInterval,
  format,
  getDay,
  parseISO,
  isWeekend
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
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1; // getMonth is 0-based

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

      // Initialize weeks map to store data by week number
      const weekData = new Map<number, WeekSummary>();

      // Track unique dates for trading days count
      const tradingDaysByWeek = new Map<number, Set<string>>();

      // For debugging: store trades by week
      const tradesByWeek = new Map<number, { date: string; pnl: number; }[]>();

      // Get week number for each trade date using the Supabase function
      const processTrade = async (tradeDate: Date) => {
        const { data: weekNumberResult } = await supabase
          .rpc('get_week_number_in_month', {
            check_date: format(tradeDate, 'yyyy-MM-dd')
          });
        
        return weekNumberResult;
      };

      // Filter and process entries
      for (const entry of (entries as JournalEntryType[] || [])) {
        if (!entry.trades || !Array.isArray(entry.trades)) continue;
        
        for (const trade of entry.trades) {
          if (!trade.entryDate) continue;
          
          const tradeDate = parseISO(trade.entryDate);
          
          // Skip if not in current month or is weekend
          if (!isWithinInterval(tradeDate, { start: monthStart, end: monthEnd }) || isWeekend(tradeDate)) {
            continue;
          }

          // Get week number from Supabase function
          const weekNumber = await processTrade(tradeDate);
          
          if (weekNumber === null) continue; // Skip trades before first Monday

          // Initialize week data if not exists
          if (!weekData.has(weekNumber)) {
            weekData.set(weekNumber, {
              weekNumber,
              totalPnL: 0,
              tradingDays: 0,
              tradeCount: 0
            });
            tradingDaysByWeek.set(weekNumber, new Set());
            tradesByWeek.set(weekNumber, []);
          }

          // Add trading day
          tradingDaysByWeek.get(weekNumber)?.add(format(tradeDate, 'yyyy-MM-dd'));
          
          const pnlValue = trade.pnl || trade.profit_loss || 0;
          const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
          
          if (!isNaN(numericPnL)) {
            const weekStats = weekData.get(weekNumber)!;
            weekStats.totalPnL += numericPnL;
            weekStats.tradeCount++;

            // Store trade details for debugging
            tradesByWeek.get(weekNumber)?.push({
              date: format(tradeDate, 'yyyy-MM-dd'),
              pnl: numericPnL
            });
          }
        }
      }

      // Update trading days count
      for (const [weekNumber, tradingDays] of tradingDaysByWeek.entries()) {
        const weekStats = weekData.get(weekNumber);
        if (weekStats) {
          weekStats.tradingDays = tradingDays.size;
        }
      }

      // Convert map to array and sort by week number
      const weeks = Array.from(weekData.values()).sort((a, b) => a.weekNumber - b.weekNumber);

      // Log detailed breakdown for debugging
      weeks.forEach(week => {
        const trades = tradesByWeek.get(week.weekNumber) || [];
        console.log(`Week ${week.weekNumber} Trade Breakdown:`, 
          trades.sort((a, b) => a.date.localeCompare(b.date))
        );
      });

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
