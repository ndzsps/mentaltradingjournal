import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format, addWeeks, isWithinInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trade } from "@/types/trade";
import { JournalEntryType } from "@/types/journal";

interface WeekSummary {
  weekNumber: number;
  totalPnL: number;
  tradingDays: number;
}

export const WeeklyPerformance = () => {
  const { user } = useAuth();
  const currentDate = new Date();

  const { data: weeklyStats, isLoading } = useQuery({
    queryKey: ['weekly-performance'],
    queryFn: async () => {
      if (!user) return [];

      const startDate = startOfWeek(addWeeks(currentDate, -4));
      const endDate = endOfWeek(currentDate);

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const weeks: WeekSummary[] = Array.from({ length: 5 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
      }));

      (entries as JournalEntryType[])?.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        
        for (let i = 0; i < 5; i++) {
          const weekStart = startOfWeek(addWeeks(currentDate, -4 + i));
          const weekEnd = endOfWeek(addWeeks(currentDate, -4 + i));
          
          if (isWithinInterval(entryDate, { start: weekStart, end: weekEnd })) {
            const trades = (entry.trades || []) as Trade[];
            const dailyPnL = trades.reduce((sum, trade) => 
              sum + (Number(trade.pnl) || 0), 0);
            
            weeks[i].totalPnL += dailyPnL;
            if (dailyPnL !== 0) {
              weeks[i].tradingDays += 1;
            }
            break;
          }
        }
      });

      return weeks.sort((a, b) => a.weekNumber - b.weekNumber);
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-rows-5 h-[calc(100vh-12rem)] pt-[150px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center px-2 mb-10">
            <Card className="p-4 space-y-2 bg-primary/5 w-full h-[4.5rem]">
              <div className="h-4 bg-primary/10 rounded w-1/3"></div>
              <div className="h-6 bg-primary/10 rounded w-2/3"></div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-12rem)] pt-[150px]">
      {weeklyStats?.map((week) => (
        <div key={week.weekNumber} className="px-2 mb-10">
          <Card
            className="p-4 bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/20 transition-colors w-full h-[4.5rem] flex flex-col justify-center"
          >
            <p className={`text-sm font-medium ${week.totalPnL === 0 ? 'text-muted-foreground' : ''}`}>
              Week {week.weekNumber}
            </p>
            <p className={`text-lg font-bold ${
              week.totalPnL > 0 
                ? 'text-emerald-500 dark:text-emerald-400'
                : week.totalPnL < 0
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-muted-foreground'
            }`}>
              ${week.totalPnL.toFixed(2)}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
};