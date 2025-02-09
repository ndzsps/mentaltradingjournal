
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trade } from "@/types/trade";
import { JournalEntryType } from "@/types/journal";
import { getWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

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
  const firstWeekOfMonth = getWeek(monthStart);

  return useQuery({
    queryKey: ['weekly-performance', selectedDate.getMonth(), selectedDate.getFullYear()],
    queryFn: async () => {
      if (!user) return [];

      // Initialize weeks array
      const weeks: WeekSummary[] = Array.from({ length: 5 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
        tradeCount: 0,
      }));

      // Track unique dates for trading days count
      const tradingDays: Set<string>[] = Array.from({ length: 5 }, () => new Set());

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Selected Month Range:', {
        start: monthStart.toISOString(),
        end: monthEnd.toISOString()
      });

      // Filter and process entries
      (entries as JournalEntryType[])?.forEach(entry => {
        if (!entry.trades || !Array.isArray(entry.trades)) return;
        
        entry.trades.forEach(trade => {
          if (!trade.entryDate) return;
          
          const tradeDate = new Date(trade.entryDate);
          
          // Debug log for trade dates
          console.log('Processing trade:', {
            date: tradeDate.toISOString(),
            isInMonth: isWithinInterval(tradeDate, { start: monthStart, end: monthEnd }),
            pnl: trade.pnl
          });

          // Strictly check if the trade falls within the selected month's interval
          if (!isWithinInterval(tradeDate, { start: monthStart, end: monthEnd })) {
            return;
          }
          
          const tradeWeek = getWeek(tradeDate);
          const weekNumber = tradeWeek - firstWeekOfMonth + 1;

          if (weekNumber >= 1 && weekNumber <= 5) {
            const weekIndex = weekNumber - 1;
            
            // Add trading day
            tradingDays[weekIndex].add(tradeDate.toISOString().split('T')[0]);
            
            const pnlValue = trade.pnl || trade.profit_loss || 0;
            const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
            
            if (!isNaN(numericPnL)) {
              weeks[weekIndex].totalPnL += numericPnL;
              weeks[weekIndex].tradeCount++;
            }
          }
        });
      });

      // Set trading days count for each week
      weeks.forEach((week, index) => {
        week.tradingDays = tradingDays[index].size;
      });

      console.log('Processed weekly stats:', weeks);

      return weeks;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
};
