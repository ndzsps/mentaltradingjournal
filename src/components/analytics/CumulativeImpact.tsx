import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

export const CumulativeImpact = () => {
  const analytics = generateAnalytics([]);
  
  const data = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    profit: Math.floor(Math.random() * 1000) * (Math.random() > 0.3 ? 1 : -1),
    emotionalScore: Math.floor(Math.random() * 100),
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Cumulative Emotional and Financial Impact</h3>
        <p className="text-sm text-muted-foreground">
          Track emotional state correlation with cumulative profits/losses
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke="#6E59A5"
              name="Profit/Loss ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="emotionalScore"
              stroke="#0EA5E9"
              name="Emotional Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          A consistent positive emotional state led to cumulative profits of $10,000, while emotional dips correlated with cumulative losses of $5,000.
        </p>
      </div>
    </Card>
  );
};