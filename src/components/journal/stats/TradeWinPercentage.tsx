import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useState } from "react";

export const TradeWinPercentage = () => {
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  const calculateWinRate = () => {
    if (!analytics?.journalEntries) return 0;

    const filteredEntries = analytics.journalEntries.filter(entry => {
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