
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
  isSameWeek
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

  return useQuery({
    queryKey: ['weekly-performance', selectedDate.getMonth(), selectedDate.getFullYear()],
    queryFn: async () => {
      if (!user) return [];

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
            }
          }
        });
      });

      // Set trading days count for each week
      weeks.forEach((week, index) => {
        week.tradingDays = tradingDays[index].size;
      });

      console.log('Processed weekly stats:', {
        month: selectedDate.toLocaleString('default', { month: 'long' }),
        year: selectedDate.getFullYear(),
        weeks
      });

      return weeks;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
};
