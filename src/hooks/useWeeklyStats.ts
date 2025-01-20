import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trade } from "@/types/trade";
import { JournalEntryType } from "@/types/journal";
import { getWeek } from "date-fns";

interface WeekSummary {
  weekNumber: number;
  totalPnL: number;
  tradingDays: number;
  tradeCount: number;
}

export const useWeeklyStats = () => {
  const { user } = useAuth();
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const firstWeekOfMonth = getWeek(monthStart);

  return useQuery({
    queryKey: ['weekly-performance'],
    queryFn: async () => {
      if (!user) return [];

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', currentDate.toISOString());

      if (error) throw error;

      const weeks: WeekSummary[] = Array.from({ length: 5 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
        tradeCount: 0,
      }));

      // Track processed trade IDs for each week
      const processedTradeIds: Set<string>[] = Array.from({ length: 5 }, () => new Set());

      (entries as JournalEntryType[])?.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        const entryWeek = getWeek(entryDate);
        const weekNumber = entryWeek - firstWeekOfMonth + 1;

        if (weekNumber >= 1 && weekNumber <= 5) {
          const weekIndex = weekNumber - 1;
          const trades = (entry.trades || []) as Trade[];
          let hasTrades = false;

          trades.forEach(trade => {
            // Only process each trade once per week using its ID
            if (trade.id && !processedTradeIds[weekIndex].has(trade.id)) {
              processedTradeIds[weekIndex].add(trade.id);
              const pnlValue = trade.pnl || trade.profit_loss || 0;
              const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
              
              if (!isNaN(numericPnL)) {
                weeks[weekIndex].totalPnL += numericPnL;
                hasTrades = true;
              }
            }
          });

          if (hasTrades) {
            weeks[weekIndex].tradingDays += 1;
          }
        }
      });

      // After processing all entries, set the trade count based on unique trade IDs
      weeks.forEach((week, index) => {
        week.tradeCount = processedTradeIds[index].size;
      });

      return weeks;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
};