import { Card } from "@/components/ui/card";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
import { PerformanceChart } from "./performance/PerformanceChart";
import { PerformanceInsight } from "./performance/PerformanceInsight";

export const PerformanceBreakdown = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });
  
  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[250px] md:h-[300px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

  // Process journal entries to calculate average P&L for each emotion
  const emotionPerformance = analytics.journalEntries.reduce((acc, entry) => {
    if (!entry.trades || entry.trades.length === 0) return acc;
    
    const totalPnL = entry.trades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
    const avgPnL = totalPnL / entry.trades.length;
    
    if (!acc[entry.emotion]) {
      acc[entry.emotion] = {
        totalPnL: 0,
        count: 0,
      };
    }
    
    acc[entry.emotion].totalPnL += avgPnL;
    acc[entry.emotion].count += 1;
    
    return acc;
  }, {} as Record<string, { totalPnL: number; count: number }>);

  const data = Object.entries(emotionPerformance).map(([emotion, stats]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    averagePnL: stats.count > 0 ? stats.totalPnL / stats.count : 0,
  })).sort((a, b) => b.averagePnL - a.averagePnL);

  // Calculate rounded max value for better axis intervals
  const maxAbsValue = Math.max(...data.map(d => Math.abs(d.averagePnL)));
  const roundedMax = Math.ceil(maxAbsValue / 100) * 100;
  const domain = [-roundedMax, roundedMax] as [number, number];

  // Generate tick values in intervals of 100 or 200 depending on the range
  const interval = roundedMax > 1000 ? 200 : 100;
  const ticks = Array.from(
    { length: Math.floor((2 * roundedMax) / interval) + 1 },
    (_, i) => -roundedMax + (i * interval)
  );

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Performance by Emotion</h3>
        <p className="text-sm text-muted-foreground">
          Average P&L per trade based on emotional state
        </p>
      </div>

      <PerformanceChart 
        data={data}
        domain={domain}
        ticks={ticks}
      />

      <PerformanceInsight 
        mainInsight={analytics.mainInsight}
        recommendedAction={analytics.recommendedAction}
      />
    </Card>
  );
};