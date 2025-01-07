import { Card } from "@/components/ui/card";
import { DollarSign, Percent, Smile, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { TradeWinPercentage } from "./TradeWinPercentage";

export const StatsHeader = () => {
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });

  const { stats } = useProgressTracking();

  // Calculate net P&L from all trades
  const netPnL = analytics?.journalEntries.reduce((total, entry) => {
    const tradePnL = entry.trades?.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) || 0;
    return total + tradePnL;
  }, 0) || 0;

  // Calculate profit factor
  const profitFactor = analytics?.journalEntries.reduce((acc, entry) => {
    const trades = entry.trades || [];
    trades.forEach(trade => {
      const pnl = Number(trade.pnl) || 0;
      if (pnl > 0) acc.profits += pnl;
      if (pnl < 0) acc.losses += Math.abs(pnl);
    });
    return acc;
  }, { profits: 0, losses: 0 }) || { profits: 0, losses: 0 };

  const profitFactorValue = profitFactor.losses === 0 ? 
    profitFactor.profits > 0 ? "∞" : "0" : 
    (profitFactor.profits / profitFactor.losses).toFixed(2);

  // Calculate emotion meter (percentage of positive emotions)
  const emotionStats = analytics?.journalEntries.reduce((acc, entry) => {
    if (entry.emotion?.toLowerCase().includes('positive')) acc.positive++;
    acc.total++;
    return acc;
  }, { positive: 0, total: 0 }) || { positive: 0, total: 0 };

  const emotionScore = emotionStats.total === 0 ? 0 : 
    (emotionStats.positive / emotionStats.total) * 100;

  if (isAnalyticsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <span className="text-sm font-medium text-muted-foreground">Profit Factor</span>
          <Percent className="h-4 w-4 text-secondary" />
        </div>
        <div className="text-2xl font-bold text-foreground">
          {profitFactorValue}
        </div>
        <div className="text-sm text-muted-foreground">
          Profit/Loss Ratio
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

      <TradeWinPercentage />

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
  );
};