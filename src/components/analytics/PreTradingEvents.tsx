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

const PREDEFINED_ACTIVITIES = [
  "Meditation",
  "Exercise",
  "Review\nDaily\nGoals",
  "Cold Shower",
  "Good Sleep",
  "Affirmation"
];

const formatValue = (value: number): string => {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
      <p className="font-medium text-sm text-foreground mb-2">{label.replace('\n', ' ')}</p>
      <div className="flex items-center gap-2 text-sm">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: payload[0].color || payload[0].fill }}
        />
        <span className="text-muted-foreground">Performance Impact:</span>
        <span className="font-medium text-foreground">
          {formatValue(payload[0].value)}
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

  // Process journal entries to calculate impact of pre-trading activities
  const activityImpact = analytics.journalEntries.reduce((acc: { [key: string]: { totalPnL: number; count: number } }, entry) => {
    if (!entry.pre_trading_activities || !entry.trades?.length) return acc;

    const dailyPnL = entry.trades.reduce((sum, trade) => {
      const pnlValue = trade.pnl || trade.profit_loss || 0;
      const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
      return sum + (isNaN(numericPnL) ? 0 : numericPnL);
    }, 0);

    entry.pre_trading_activities.forEach(activity => {
      // Replace spaces with newlines for comparison
      const normalizedActivity = activity.replace("Review Daily Goals", "Review\nDaily\nGoals");
      if (PREDEFINED_ACTIVITIES.includes(normalizedActivity)) {
        if (!acc[normalizedActivity]) {
          acc[normalizedActivity] = { totalPnL: 0, count: 0 };
        }
        acc[normalizedActivity].totalPnL += dailyPnL;
        acc[normalizedActivity].count += 1;
      }
    });

    return acc;
  }, {});

  // Calculate average impact for each predefined activity
  const data = PREDEFINED_ACTIVITIES.map(activity => {
    const stats = activityImpact[activity] || { totalPnL: 0, count: 0 };
    const averageImpact = stats.count > 0 ? (stats.totalPnL / stats.count) : 0;
    return {
      activity,
      impact: parseFloat(averageImpact.toFixed(2)),
      fill: averageImpact > 0 ? "#6E59A5" : "#FEC6A1"
    };
  }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  // Find most positive and negative impacts for insights
  const mostPositive = data.reduce((prev, current) => 
    current.impact > prev.impact ? current : prev, { impact: -Infinity, activity: '' });
  const mostNegative = data.reduce((prev, current) => 
    current.impact < prev.impact ? current : prev, { impact: Infinity, activity: '' });

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Pre-Trading Activities Impact</h3>
        <p className="text-sm text-muted-foreground">
          How different activities affect your trading performance
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 5, right: 5, left: 25, bottom: 5 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="activity" 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
              tickFormatter={formatValue}
              width={80}
              label={{ 
                value: 'Average P&L per Trade', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { 
                  textAnchor: 'middle',
                  fontSize: '12px',
                  fill: 'currentColor'
                }
              }}
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
        <h4 className="font-semibold text-sm md:text-base">Activity Impact Analysis</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          {mostPositive.activity && (
            <p><span className="font-medium text-foreground">{mostPositive.activity.replace(/\n/g, ' ')}</span> shows the strongest positive impact on your trading, improving performance by {formatValue(mostPositive.impact)}.</p>
          )}
          {mostNegative.activity && mostNegative.impact < 0 && (
            <p>Consider reviewing your {mostNegative.activity.toLowerCase().replace(/\n/g, ' ')} routine, as it correlates with a {formatValue(Math.abs(mostNegative.impact))} decrease in performance.</p>
          )}
        </div>
      </div>
    </Card>
  );
};