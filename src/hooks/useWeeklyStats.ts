
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  startOfMonth, 
  endOfMonth,
  format,
  parseISO,
  isWeekend
} from "date-fns";
import { Trade } from "@/types/trade";

interface WeekSummary {
  weekNumber: number;
  totalPnL: number;
  tradingDays: number;
  tradeCount: number;
}

interface JournalEntry {
  created_at: string;
  trades?: Trade[];
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

        // Process entries by date first to avoid double counting
        const dailyStats = new Map<string, { pnl: number, tradeCount: number }>();
        
        // Calculate daily totals first
        (entries || []).forEach((entry: JournalEntry) => {
          const entryDate = format(parseISO(entry.created_at), 'yyyy-MM-dd');
          
          // Skip weekends
          if (isWeekend(parseISO(entry.created_at))) {
            return;
          }

          if (!dailyStats.has(entryDate)) {
            dailyStats.set(entryDate, { pnl: 0, tradeCount: 0 });
          }

          const dailyStat = dailyStats.get(entryDate)!;

          // Process trades array
          if (entry.trades && Array.isArray(entry.trades)) {
            entry.trades.forEach((trade: Trade) => {
              // Handle different PnL field formats
              const pnlValue = trade.pnl || trade.profit_loss || 0;
              const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
              if (!isNaN(numericPnL)) {
                dailyStat.pnl += numericPnL;
                dailyStat.tradeCount += 1;
              }
            });
          }
        });

        // Now process daily stats into weekly stats
        for (const [dateStr, stats] of dailyStats.entries()) {
          const date = parseISO(dateStr);
          
          // Get week number for this date
          const { data: weekNumber } = await supabase
            .rpc('get_week_number_in_month', {
              check_date: dateStr
            });

          if (weekNumber === null) continue;

          const weekIndex = allWeeks.findIndex(w => w.weekNumber === weekNumber);
          if (weekIndex !== -1) {
            allWeeks[weekIndex].totalPnL += stats.pnl;
            allWeeks[weekIndex].tradeCount += stats.tradeCount;
            allWeeks[weekIndex].tradingDays += 1;
          }
        }

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
