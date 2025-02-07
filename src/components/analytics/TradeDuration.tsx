
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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
      <p className="font-medium text-sm text-foreground mb-2">{label}</p>
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-muted-foreground">
            {item.name === 'winRate' ? 'Win Rate:' : '# of Trades:'}
          </span>
          <span className="font-medium text-foreground">
            {item.name === 'winRate' ? 
              `${item.value.toFixed(1)}%` : 
              `${item.value} trades`}
          </span>
        </div>
      ))}
    </div>
  );
};

export const TradeDuration = () => {
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

  // Process trades to calculate durations and win rates
  const allTrades = analytics.journalEntries.flatMap(entry => entry.trades || []);
  
  const calculateDuration = (trade: any) => {
    const entryTime = new Date(trade.entryDate).getTime();
    const exitTime = new Date(trade.exitDate).getTime();
    return (exitTime - entryTime) / (1000 * 60); // Duration in minutes
  };

  const durationRanges = [
    { max: 10, label: "< 10 min" },
    { max: 30, label: "10-30 min" },
    { max: 60, label: "30-60 min" },
    { max: Infinity, label: "> 1 hour" },
  ];

  const data = durationRanges.map(range => {
    const tradesInRange = allTrades.filter(trade => {
      const duration = calculateDuration(trade);
      return duration <= range.max;
    });

    const totalTrades = tradesInRange.length;
    const winningTrades = tradesInRange.filter(trade => Number(trade.pnl) > 0).length;

    return {
      duration: range.label,
      winRate: totalTrades ? (winningTrades / totalTrades) * 100 : 0,
      tradeCount: totalTrades,
    };
  });

  const bestDuration = data.reduce((prev, current) => 
    current.winRate > prev.winRate ? current : prev
  );

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Trade Duration Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Performance based on how long trades are held
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="duration" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar 
              dataKey="tradeCount" 
              fill="#0EA5E9" 
              name="# of Trades" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="winRate" 
              fill="#6E59A5" 
              name="Win Rate" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Your {bestDuration.duration} trades have a {bestDuration.winRate.toFixed(1)}% win rate.</p>
          <p>Consider focusing more on trades within this duration range for optimal results.</p>
        </div>
      </div>
    </Card>
  );
};
