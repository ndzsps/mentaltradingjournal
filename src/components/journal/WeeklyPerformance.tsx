import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format, addWeeks, isWithinInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

      const startDate = startOfWeek(addWeeks(currentDate, -5));
      const endDate = endOfWeek(currentDate);

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      // Initialize 6 weeks of data
      const weeks: WeekSummary[] = Array.from({ length: 6 }, (_, i) => ({
        weekNumber: i + 1,
        totalPnL: 0,
        tradingDays: 0,
      }));

      // Process entries
      entries?.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        
        // Find which week this entry belongs to
        for (let i = 0; i < 6; i++) {
          const weekStart = startOfWeek(addWeeks(currentDate, -5 + i));
          const weekEnd = endOfWeek(addWeeks(currentDate, -5 + i));
          
          if (isWithinInterval(entryDate, { start: weekStart, end: weekEnd })) {
            // Calculate total P&L from trades
            const dailyPnL = entry.trades?.reduce((sum: number, trade: any) => 
              sum + (Number(trade.pnl) || 0), 0) || 0;
            
            weeks[i].totalPnL += dailyPnL;
            
            // Only count unique trading days
            if (dailyPnL !== 0) {
              weeks[i].tradingDays += 1;
            }
            break;
          }
        }
      });

      return weeks;
    },
  });

  if (isLoading) {
    return (
      <Card className="w-64 p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-primary/10 rounded w-1/3"></div>
              <div className="h-6 bg-primary/10 rounded w-2/3"></div>
              <div className="h-4 bg-primary/10 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-64 p-4 space-y-4 bg-card/30 backdrop-blur-xl border-primary/10">
      {weeklyStats?.map((week) => (
        <div
          key={week.weekNumber}
          className="p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
        >
          <div className="space-y-1">
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
            <p className="text-sm text-muted-foreground">
              {week.tradingDays} {week.tradingDays === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      ))}
    </Card>
  );
};