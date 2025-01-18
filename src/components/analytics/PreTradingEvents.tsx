import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
      <p className="font-medium text-sm text-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2 text-sm">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: payload[0].color || payload[0].fill }}
        />
        <span className="text-muted-foreground">Impact:</span>
        <span className="font-medium text-foreground">
          {payload[0].value > 0 ? '+' : ''}{payload[0].value}%
        </span>
      </div>
    </div>
  );
};

export const PreTradingEvents = () => {
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

  console.log('Raw journal entries:', analytics.journalEntries);

  // Process journal entries to calculate impact of pre-trading activities
  const activityImpact = analytics.journalEntries.reduce((acc: { [key: string]: { totalPnL: number; count: number } }, entry) => {
    // Log each entry being processed
    console.log('Processing entry:', {
      pre_trading_activities: entry.pre_trading_activities,
      trades: entry.trades,
      hasActivities: Boolean(entry.pre_trading_activities),
      hasTrades: Boolean(entry.trades?.length)
    });

    if (!entry.pre_trading_activities || !entry.trades?.length) {
      console.log('Skipping entry - missing activities or trades');
      return acc;
    }

    const dailyPnL = entry.trades.reduce((sum, trade) => {
      const pnlValue = trade.pnl || trade.profit_loss || 0;
      const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
      console.log('Trade PnL:', { raw: pnlValue, numeric: numericPnL });
      return sum + (isNaN(numericPnL) ? 0 : numericPnL);
    }, 0);

    console.log('Daily PnL:', dailyPnL);

    entry.pre_trading_activities.forEach(activity => {
      if (!acc[activity]) {
        acc[activity] = { totalPnL: 0, count: 0 };
      }
      acc[activity].totalPnL += dailyPnL;
      acc[activity].count += 1;
      console.log(`Activity "${activity}" stats:`, acc[activity]);
    });

    return acc;
  }, {});

  console.log('Activity impact data:', activityImpact);

  // Calculate average impact percentage for each activity
  const data = Object.entries(activityImpact)
    .filter(([_, stats]) => {
      const hasEnoughData = stats.count >= 3;
      console.log('Activity stats:', { stats, hasEnoughData });
      return hasEnoughData;
    })
    .map(([activity, stats]) => {
      const averageImpact = (stats.totalPnL / stats.count) * 100 / 1000;
      return {
        event: activity,
        impact: parseFloat(averageImpact.toFixed(2)),
        fill: averageImpact > 0 ? "#6E59A5" : "#FEC6A1"
      };
    })
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 5);

  console.log('Final chart data:', data);

  // Find most positive and negative impacts for insights
  const mostPositive = data.reduce((prev, current) => 
    current.impact > prev.impact ? current : prev, { impact: -Infinity, event: '' });
  const mostNegative = data.reduce((prev, current) => 
    current.impact < prev.impact ? current : prev, { impact: Infinity, event: '' });

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Impact of Pre-Trading Events</h3>
        <p className="text-sm text-muted-foreground">
          How different activities before trading affect performance
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="event" 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'currentColor', opacity: 0.1 }}
            />
            <Bar 
              dataKey="impact"
              fill="#6E59A5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          {data.length > 0 ? (
            <>
              {mostNegative.event && (
                <p>{mostNegative.event} activities resulted in a {Math.abs(mostNegative.impact).toFixed(1)}% drop in performance. Consider limiting these sessions.</p>
              )}
              {mostPositive.event && (
                <p>{mostPositive.event} before trading increased performance by {mostPositive.impact.toFixed(1)}%.</p>
              )}
            </>
          ) : (
            <p>Add more journal entries with pre-trading activities to see their impact on your performance.</p>
          )}
        </div>
      </div>
    </Card>
  );
};