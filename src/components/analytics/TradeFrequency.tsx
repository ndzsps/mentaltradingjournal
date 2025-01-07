import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

export const TradeFrequency = () => {
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

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const data = last7Days.map(date => {
    const entriesForDay = analytics.journalEntries.filter(entry => 
      entry.created_at.split('T')[0] === date
    );
    
    const tradesCount = entriesForDay.reduce((sum, entry) => 
      sum + (entry.trades?.length || 0), 0
    );

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      trades: tradesCount,
    };
  });

  const formatYAxisTick = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  const averageTrades = data.reduce((sum, day) => sum + day.trades, 0) / data.length;

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Trade Frequency</h3>
        <p className="text-sm text-muted-foreground">
          Number of trades executed per day
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={formatYAxisTick}
              label={{ 
                value: 'Number of Trades', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [formatYAxisTick(value), 'Trades']}
              labelStyle={{ color: 'var(--foreground)' }}
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="trades" 
              fill="#6E59A5" 
              stroke="#6E59A5" 
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          Your trading frequency averages {averageTrades.toFixed(1)} trades per day, with peak activity on {data.reduce((max, day) => day.trades > max.trades ? day : max).date}.
        </p>
      </div>
    </Card>
  );
};