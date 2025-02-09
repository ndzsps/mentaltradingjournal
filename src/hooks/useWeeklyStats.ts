
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntryType } from "@/types/journal";
import { 
  startOfMonth, 
  endOfMonth,
  format,
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
      
      // Always initialize 5 weeks
      const allWeeks: WeekSummary[] = Array.from({ length: 5 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
        tradeCount: 0
      }));

      // Get existing stats from week_stats table
      const { data: weekStats, error: weekStatsError } = await supabase
        .from('week_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .order('week_number', { ascending: true });

      if (weekStatsError) {
        throw weekStatsError;
      }

      // If we have stats, use them
      if (weekStats && weekStats.length > 0) {
        weekStats.forEach(stat => {
          const weekIndex = allWeeks.findIndex(w => w.weekNumber === stat.week_number);
          if (weekIndex !== -1) {
            allWeeks[weekIndex] = {
              weekNumber: stat.week_number,
              totalPnL: Number(stat.total_pnl),
              tradingDays: stat.trading_days,
              tradeCount: stat.trade_count
            };
          }
        });
      } else {
        // If no stats exist, calculate them from journal entries
        const { data: entries, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', format(monthStart, 'yyyy-MM-dd'))
          .lte('created_at', format(monthEnd, 'yyyy-MM-dd'))
          .order('created_at', { ascending: true });

        if (error) throw error;

        const tradingDaysByWeek = new Map<number, Set<string>>();
        
        // Process each entry sequentially
        for (const entry of entries || []) {
          const entryDate = parseISO(entry.created_at);
          
          // Skip weekends
          if (isWeekend(entryDate)) {
            continue;
          }

          // Get week number
          const { data: weekNumber, error: weekError } = await supabase
            .rpc('get_week_number_in_month', {
              check_date: format(entryDate, 'yyyy-MM-dd')
            });

          if (weekError || weekNumber === null) {
            console.error('Error getting week number:', weekError);
            continue;
          }

          // Initialize tracking for this week if needed
          if (!tradingDaysByWeek.has(weekNumber)) {
            tradingDaysByWeek.set(weekNumber, new Set());
          }

          // Add trading day
          tradingDaysByWeek.get(weekNumber)?.add(format(entryDate, 'yyyy-MM-dd'));

          // Calculate total P&L from trades array
          if (entry.trades && Array.isArray(entry.trades)) {
            const dayTotalPnL = entry.trades.reduce((total, trade) => {
              const pnlValue = (trade as any).pnl || (trade as any).profit_loss || 0;
              const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
              return !isNaN(numericPnL) ? total + numericPnL : total;
            }, 0);

            const weekIndex = allWeeks.findIndex(w => w.weekNumber === weekNumber);
            if (weekIndex !== -1) {
              allWeeks[weekIndex].totalPnL += dayTotalPnL;
              allWeeks[weekIndex].tradeCount += entry.trades.length;
            }
          }
        }

        // Update trading days count
        tradingDaysByWeek.forEach((tradingDays, weekNumber) => {
          const weekIndex = allWeeks.findIndex(w => w.weekNumber === weekNumber);
          if (weekIndex !== -1) {
            allWeeks[weekIndex].tradingDays = tradingDays.size;
          }
        });

        // Store the calculated stats
        for (const week of allWeeks) {
          await supabase
            .from('week_stats')
            .upsert({
              user_id: user.id,
              year,
              month,
              week_number: week.weekNumber,
              total_pnl: week.totalPnL,
              trading_days: week.tradingDays,
              trade_count: week.tradeCount
            }, {
              onConflict: 'user_id,year,month,week_number'
            });
        }
      }

      return allWeeks.sort((a, b) => a.weekNumber - b.weekNumber);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
};
