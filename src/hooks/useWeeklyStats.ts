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
      }));

      (entries as JournalEntryType[])?.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        const entryWeek = getWeek(entryDate);
        const weekNumber = entryWeek - firstWeekOfMonth + 1;

        console.log('Processing entry:', {
          date: entryDate,
          entryWeek,
          firstWeekOfMonth,
          calculatedWeekNumber: weekNumber,
          trades: entry.trades
        });

        if (weekNumber >= 1 && weekNumber <= 5) {
          const trades = (entry.trades || []) as Trade[];
          const dailyPnL = trades.reduce((sum, trade) => {
            const pnl = Number(trade.pnl) || 0;
            console.log('Trade PnL:', pnl);
            return sum + pnl;
          }, 0);
          
          console.log('Daily PnL for week', weekNumber, ':', dailyPnL);
          
          weeks[weekNumber - 1].totalPnL += dailyPnL;
          if (dailyPnL !== 0) {
            weeks[weekNumber - 1].tradingDays += 1;
          }
        }
      });

      return weeks;
    },
  });
};