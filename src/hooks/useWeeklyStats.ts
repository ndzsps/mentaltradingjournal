
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntryType } from "@/types/journal";
import { 
  startOfMonth, 
  endOfMonth,
  isWithinInterval,
  format,
  parseISO,
  isWeekend,
  eachDayOfInterval
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
        console.error('Error fetching week stats:', weekStatsError);
        throw weekStatsError;
      }

      // If we have stats, update the corresponding weeks
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
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Track unique dates for trading days count
        const tradingDaysByWeek = new Map<number, Set<string>>();
        
        // For debugging: store trades by week
        const tradesByWeek = new Map<number, { date: string; pnl: number; entryId: string }[]>();

        // Log the date range we're analyzing
        console.log('Processing trades for month:', format(monthStart, 'MMMM yyyy'));
        console.log('Date range:', format(monthStart, 'yyyy-MM-dd'), 'to', format(monthEnd, 'yyyy-MM-dd'));
        
        // Log all days in Week 1 (1st-7th)
        const week1Days = eachDayOfInterval({
          start: monthStart,
          end: new Date(year, month - 1, 7)
        });
        console.log('Week 1 dates being checked:', week1Days.map(d => format(d, 'yyyy-MM-dd')));
        
        // Process each trade
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
            const { data: weekNumber } = await supabase
              .rpc('get_week_number_in_month', {
                check_date: format(tradeDate, 'yyyy-MM-dd')
              });
            
            // Detailed logging for Week 1 trades
            if (weekNumber === 1) {
              console.log('Week 1 Trade:', {
                date: format(tradeDate, 'yyyy-MM-dd'),
                dayOfMonth: tradeDate.getDate(),
                pnl: trade.pnl || trade.profit_loss || 0,
                entryId: entry.id
              });
            }

            if (weekNumber === null) continue;

            // Initialize tracking for this week if needed
            if (!tradingDaysByWeek.has(weekNumber)) {
              tradingDaysByWeek.set(weekNumber, new Set());
            }
            if (!tradesByWeek.has(weekNumber)) {
              tradesByWeek.set(weekNumber, []);
            }

            // Add trading day
            tradingDaysByWeek.get(weekNumber)?.add(format(tradeDate, 'yyyy-MM-dd'));
            
            const pnlValue = trade.pnl || trade.profit_loss || 0;
            const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
            
            if (!isNaN(numericPnL)) {
              const weekIndex = allWeeks.findIndex(w => w.weekNumber === weekNumber);
              if (weekIndex !== -1) {
                allWeeks[weekIndex].totalPnL += numericPnL;
                allWeeks[weekIndex].tradeCount++;

                // Store trade details for debugging
                tradesByWeek.get(weekNumber)?.push({
                  date: format(tradeDate, 'yyyy-MM-dd'),
                  pnl: numericPnL,
                  entryId: entry.id
                });
              }
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

        // Log Week 1 final breakdown
        console.log('Week 1 Final Summary:', {
          totalPnL: allWeeks[0].totalPnL,
          tradingDays: allWeeks[0].tradingDays,
          tradeCount: allWeeks[0].tradeCount,
          trades: tradesByWeek.get(1)?.sort((a, b) => a.date.localeCompare(b.date))
        });

        // Store the calculated stats in the week_stats table
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
