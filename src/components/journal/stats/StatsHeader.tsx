
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { TradeWinPercentage } from "./TradeWinPercentage";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import { startOfMonth, subMonths, isWithinInterval, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { DollarSign, Smile, Flame, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useProgressTracking } from "@/hooks/useProgressTracking";

export const StatsHeader = () => {
  const queryClient = useQueryClient();
  const { state, toggleSidebar } = useSidebar();
  
  // Set up real-time subscription for journal entries
  useEffect(() => {
    const channel = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Invalidate and refetch analytics when journal entries change
          queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  // Log analytics data for debugging
  useEffect(() => {
    if (analytics) {
      console.log('Fetched analytics data:', {
        entriesCount: analytics.journalEntries?.length,
        entries: analytics.journalEntries
      });
    }
  }, [analytics]);

  const { stats } = useProgressTracking();
  const { timeFilter, setTimeFilter } = useTimeFilter();

  const getTimeInterval = () => {
    const now = new Date();
    switch (timeFilter) {
      case "this-month":
        return {
          start: startOfDay(subMonths(now, 1)),
          end: endOfDay(now)
        };
      case "last-month":
        return {
          start: startOfDay(subMonths(now, 3)),
          end: endOfDay(now)
        };
      case "last-three-months":
        return {
          start: startOfDay(subMonths(now, 12)),
          end: endOfDay(now)
        };
      default:
        return null;
    }
  };

  const filterEntriesByTime = (entries: any[]) => {
    const interval = getTimeInterval();
    if (!interval) return entries;

    console.log('Filtering entries with interval:', interval);

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      
      // Check if the entry has trades
      if (entry.trades && entry.trades.length > 0) {
        // For entries with trades, check if any trade's exit date falls within the interval
        return entry.trades.some((trade: any) => {
          const exitDate = trade.exitDate ? new Date(trade.exitDate) : new Date(entry.created_at);
          return isWithinInterval(exitDate, interval);
        });
      }
      
      // For entries without trades, use the created_at date
      return isWithinInterval(entryDate, interval);
    });

    console.log('Filtered entries:', {
      beforeFilter: entries.length,
      afterFilter: filteredEntries.length,
      entries: filteredEntries
    });

    return filteredEntries;
  };

  const filteredEntries = analytics ? filterEntriesByTime(analytics.journalEntries) : [];

  // Calculate net P&L from filtered trades with proper numeric conversion and unique trade tracking
  const processedTradeIds = new Set<string>();
  const netPnL = filteredEntries.reduce((total, entry) => {
    if (!entry.trades) return total;
    
    return total + entry.trades.reduce((sum: number, trade: any) => {
      if (trade?.id && !processedTradeIds.has(trade.id)) {
        processedTradeIds.add(trade.id);
        const pnlValue = trade.pnl || 0;
        const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
        return sum + (isNaN(numericPnL) ? 0 : numericPnL);
      }
      return sum;
    }, 0);
  }, 0);

  // Calculate emotion score
  const emotionStats = filteredEntries.reduce((acc, entry) => {
    if (entry.emotion?.toLowerCase().includes('positive')) acc.positive++;
    acc.total++;
    return acc;
  }, { positive: 0, total: 0 });

  const emotionScore = emotionStats.total === 0 ? 0 : 
    (emotionStats.positive / emotionStats.total) * 100;

  if (isAnalyticsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-start gap-2">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-16 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-primary/10"
          title={state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {state === "expanded" ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant={timeFilter === "this-month" ? "default" : "outline"}
          onClick={() => setTimeFilter("this-month")}
        >
          Last 30 Days
        </Button>
        <Button 
          variant={timeFilter === "last-month" ? "default" : "outline"}
          onClick={() => setTimeFilter("last-month")}
        >
          Last Quarter
        </Button>
        <Button 
          variant={timeFilter === "last-three-months" ? "default" : "outline"}
          onClick={() => setTimeFilter("last-three-months")}
        >
          Last Year
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Net P&L</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${Math.abs(netPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netPnL >= 0 ? '▲' : '▼'} {netPnL >= 0 ? 'Profit' : 'Loss'}
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Emotion Meter</span>
            <Smile className="h-4 w-4 text-accent-dark" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {emotionScore.toFixed(0)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Positive Emotions
          </div>
        </Card>

        <TradeWinPercentage timeFilter={timeFilter} />

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Daily Streak</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.dailyStreak}
          </div>
          <div className="text-sm text-muted-foreground">
            Days Active
          </div>
        </Card>
      </div>
    </div>
  );
};
