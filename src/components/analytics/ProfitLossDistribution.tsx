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
        <span className="text-muted-foreground">Count:</span>
        <span className="font-medium text-foreground">{payload[0].value}</span>
      </div>
    </div>
  );
};

export const ProfitLossDistribution = () => {
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

  // Process trades from journal entries to create P/L distribution
  const allTrades = analytics.journalEntries.flatMap(entry => entry.trades || []);
  const ranges = [
    { min: -Infinity, max: -1000, label: "-$1000+" },
    { min: -1000, max: -500, label: "-$500 to -$1000" },
    { min: -500, max: -100, label: "-$100 to -$500" },
    { min: -100, max: 100, label: "-$100 to $100" },
    { min: 100, max: 500, label: "$100 to $500" },
    { min: 500, max: 1000, label: "$500 to $1000" },
    { min: 1000, max: Infinity, label: "$1000+" },
  ];

  const data = ranges.map(range => ({
    range: range.label,
    count: allTrades.filter(trade => {
      const pnl = Number(trade.pnl);
      return pnl > range.min && pnl <= range.max;
    }).length,
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Profit/Loss Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of trade outcomes across different P/L ranges
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="range" 
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
              dataKey="count" 
              fill="#6E59A5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          {data.find(d => d.range === "-$100 to $100")?.count > 
           Math.max(...data.map(d => d.count)) / 2
            ? "Most of your trades fall within the -$100 to $100 range, suggesting consistent but conservative position sizing."
            : "Your trade outcomes show varied distribution. Consider reviewing position sizing strategy for more consistent results."}
        </p>
      </div>
    </Card>
  );
};