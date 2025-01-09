import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format, addWeeks, isWithinInterval, subWeeks, getWeek } from "date-fns";
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
  const currentWeek = getWeek(currentDate);
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const firstWeekOfMonth = getWeek(monthStart);

  const { data: weeklyStats, isLoading } = useQuery({
    queryKey: ['weekly-performance'],
    queryFn: async () => {
      if (!user) return [];

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', endOfWeek(currentDate).toISOString());

      if (error) throw error;

      // Initialize weeks array (5 weeks)
      const weeks: WeekSummary[] = Array.from({ length: 5 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
      }));

      // Process entries
      (entries as JournalEntryType[])?.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        const entryWeek = getWeek(entryDate);
        
        // Calculate relative week number (1-based)
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

      console.log('Current week:', currentWeek);
      console.log('First week of month:', firstWeekOfMonth);
      console.log('Processed weeks:', weeks);

      return weeks;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-rows-5 h-[calc(100vh-20rem)] pt-[150px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center px-2 mb-8">
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
    <div className="flex flex-col h-[calc(100vh-20rem)] pt-[150px]">
      {weeklyStats?.map((week) => (
        <div key={week.weekNumber} className="px-2 mb-6">
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