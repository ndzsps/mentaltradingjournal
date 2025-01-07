import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

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
  const domain = [-roundedMax, roundedMax];

  // Generate tick values in intervals of 100 or 200 depending on the range
  const interval = roundedMax > 1000 ? 200 : 100;
  const ticks = Array.from(
    { length: Math.floor((2 * roundedMax) / interval) + 1 },
    (_, i) => -roundedMax + (i * interval)
  );

  // Format number to K notation if >= 1000
  const formatYAxisTick = (value: number): string => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Performance by Emotion</h3>
        <p className="text-sm text-muted-foreground">
          Average P&L per trade based on emotional state
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="emotion" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={domain}
              ticks={ticks}
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxisTick}
              label={{ 
                value: 'Average P&L per Trade', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [formatYAxisTick(value), 'Average P&L']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ 
                color: 'hsl(var(--foreground))',
                fontWeight: 500,
                marginBottom: '4px'
              }}
              itemStyle={{
                color: 'hsl(var(--foreground))',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="averagePnL" 
              radius={[4, 4, 0, 0]}
              fill="hsl(142.1 76.2% 46.3%)"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.averagePnL > 500
                      ? "hsl(142.1 76.2% 36.3%)"
                      : entry.averagePnL > 0
                      ? "hsl(142.1 76.2% 46.3%)"
                      : entry.averagePnL > -500
                      ? "hsl(346.8 77.2% 49.8%)"
                      : "hsl(346.8 77.2% 39.8%)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          {analytics.mainInsight} {analytics.recommendedAction}
        </p>
      </div>
    </Card>
  );
};