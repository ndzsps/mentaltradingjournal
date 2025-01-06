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

export const ProfitLossDistribution = () => {
  const analytics = generateAnalytics([]);
  
  const data = [
    { range: "-$1000+", count: 5 },
    { range: "-$500 to -$1000", count: 8 },
    { range: "-$100 to -$500", count: 15 },
    { range: "-$100 to $100", count: 25 },
    { range: "$100 to $500", count: 20 },
    { range: "$500 to $1000", count: 12 },
    { range: "$1000+", count: 7 },
  ];

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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#6E59A5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          Most of your trades fall within the -$100 to $100 range, suggesting consistent but conservative position sizing.
        </p>
      </div>
    </Card>
  );
};