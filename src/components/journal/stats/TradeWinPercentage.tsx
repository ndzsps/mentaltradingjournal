
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useState } from "react";
import { TimeFilter } from "@/hooks/useJournalFilters";
import { startOfMonth, subMonths, startOfQuarter, isWithinInterval, endOfMonth } from "date-fns";

interface TradeWinPercentageProps {
  timeFilter: TimeFilter;
}

export const TradeWinPercentage = ({ timeFilter }: TradeWinPercentageProps) => {
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  const getTimeInterval = () => {
    const now = new Date();
    switch (timeFilter) {
      case "this-month":
        return {
          start: startOfMonth(now),
          end: now
        };
      case "last-month":
        return {
          start: startOfMonth(subMonths(now, 1)),
          end: endOfMonth(subMonths(now, 1))
        };
      case "last-three-months":
        return {
          start: startOfMonth(subMonths(now, 3)),
          end: now
        };
      default:
        return null;
    }
  };

  const calculateWinRate = () => {
    if (!analytics?.journalEntries) return 0;

    let filteredEntries = analytics.journalEntries;
    
    // Only consider post-session entries
    filteredEntries = filteredEntries.filter(entry => entry.session_type === 'post');
    
    // Apply time filter
    const interval = getTimeInterval();
    if (interval) {
      filteredEntries = filteredEntries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return isWithinInterval(entryDate, interval);
      });
    }

    // Apply emotion filter
    filteredEntries = filteredEntries.filter(entry => {
      if (emotionFilter === "all") return true;
      return entry.emotion?.toLowerCase().includes(emotionFilter.toLowerCase());
    });

    const allTrades = filteredEntries.flatMap(entry => entry.trades || []);
    const winningTrades = allTrades.filter(trade => Number(trade.pnl) > 0);
    
    return allTrades.length > 0 
      ? (winningTrades.length / allTrades.length) * 100 
      : 0;
  };

  const winRate = calculateWinRate();

  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-16 bg-muted rounded"></div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Trade Win %</span>
        <ArrowUpDown className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl font-bold text-foreground">
        {winRate.toFixed(1)}%
      </div>
      <div className="mt-2">
        <Select
          value={emotionFilter}
          onValueChange={setEmotionFilter}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Emotions</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
